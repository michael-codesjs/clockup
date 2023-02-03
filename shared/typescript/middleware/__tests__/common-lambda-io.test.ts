import middy from "@middy/core";
import { APIGatewayProxyEvent, AppSyncResolverEvent, Context, EventBridgeEvent, SNSEvent, SNSEventRecord, SQSEvent } from "aws-lambda";
import SQS from "aws-sdk/clients/sqs";
import { CommonInput } from "../../io/types/main";
import { chance } from "../../utilities/constants";
import { configureEnviromentVariables } from "../../utilities/functions";
import { commonLambdaIO } from "../common-lambda-io";
import { CommonIOHandler, StateMachineEvent } from "../common-lambda-io/types";

const { TEST_QUEUE_URL } = configureEnviromentVariables();

describe("CommonLambdaIO", () => {

  let type: string;

  beforeEach(() => {
    type = chance.string({ alpha: true, casing: "upper", numeric: false, symbols: false });
  });

  type INPUT = CommonInput<string, {
    string: string,
    number: number,
    boolean: boolean,
    array: Array<any>
    object: Record<string, any>
  }>;

  const generateInput = (meta: Record<string, any> = {}): INPUT => ({
    type: chance.word().toUpperCase(),
    correlationId: chance.guid(),
    meta,
    payload: {
      string: chance.string(),
      number: chance.integer(),
      boolean: chance.bool(),
      array: Array(chance.integer({ min: 1, max: 10 })).fill(null).map(() => chance.string()),
      object: {
        [chance.string()]: chance.string()
      }
    }
  });

  const getSNSEvent = (): SNSEvent => ({
    Records: Array(chance.integer({ min: 1, max: 10 })).fill(null).map(() => {
      const message = generateInput();
      return {
        EventVersion: "1",
        EventSubscriptionArn: chance.string(),
        EventSource: "aws:sns",
        Sns: {
          Message: JSON.stringify(message),
          Messages: { type },
          MessageId: chance.fbid(),
          Signature: chance.string(),
        }
      } as unknown as SNSEventRecord
    })
  });

  const getSQSEvent = (reply: boolean = false): SQSEvent => ({
    Records: Array(chance.integer({ min: 1, max: reply ? 1 : 10 })).fill(null).map(() => {
      const input = generateInput(reply ? { replyTo: TEST_QUEUE_URL } : {});
      return {
        messageId: chance.fbid(),
        eventSource: "aws:sqs",
        attributes: {},
        body: JSON.stringify(input)
      } as unknown as SQSEvent["Records"][number];
    })
  });

  const getStateMachineEvent = (): StateMachineEvent<INPUT> => ({
    source: "StateMachine",
    attributes: {
      Type: "CREATE",
      correlationId: chance.fbid()
    },
    payload: generateInput()
  });

  const getApiGatewayEvent = (): APIGatewayProxyEvent => ({
    body: generateInput(),
    httpMethod: "GET",
    headers: {},
    path: "/"
  } as unknown as APIGatewayProxyEvent);

  const getAppSyncEvent = (inInput = true): AppSyncResolverEvent<any, any> => {
    const input = generateInput();
    return {
      arguments: inInput ? { input } : input,
      info: {},
      prev: {},
      request: {},
      source: {},
      identity: {
        sub: chance.string()
      },
      stash: {},
    } as AppSyncResolverEvent<any, any>;
  }

  const getEventBridgeEvent = (): EventBridgeEvent<INPUT["type"], INPUT> => {
    const input = generateInput();
    return {
      "detail-type": input.type,
      detail: input,
      source: "clockup.shared.tests.middleware.common-lambda-io",
    } as EventBridgeEvent<INPUT["type"], INPUT>;
  }

  const withMiddleware = (lambda: any) => middy(lambda).use(commonLambdaIO());

  /*
  test("SNS input", () => {

    const sqsEvent = getSNSEvent();

    const lambda: CommonIOHandler<Input, void> = async event => {
      event.inputs.forEach((input, index) => {
        const snsEventEquivalentInput = JSON.parse(sqsEvent.Records[index].Sns.Message)
        expect(input).toMatchObject(snsEventEquivalentInput);
      });
    };

    withMiddleware(lambda)(sqsEvent, {} as Context);

  });
  */
 
  test("SQS request", async () => {

    const sqsEvent = getSQSEvent();

    const lambda: CommonIOHandler<INPUT, any> = async event => {
      event.inputs.forEach((input, index) => {
        const sqsEventEquivalentInput = JSON.parse(sqsEvent.Records[index].body);
        expect(input).toMatchObject(sqsEventEquivalentInput);
      });
      return event.inputs;
    };

    await withMiddleware(lambda)(sqsEvent, {} as Context);

  });

  test("SQS response", async () => {

    const sqsEvent = getSQSEvent(true);

    const lambda: CommonIOHandler<INPUT, any> = async event => {
      return event.inputs;
    };

    await withMiddleware(lambda)(sqsEvent, {} as Context);

    // get message which is supposed to be sent to the replyQueue(TEST_QUEUE);

    const response = await new SQS({ apiVersion: '2012-11-05' })
      .receiveMessage({ QueueUrl: TEST_QUEUE_URL, WaitTimeSeconds: 0 })
      .promise();

    // console.log("Res:", response);

    const { type, correlationId } = JSON.parse(sqsEvent.Records[0].body);

    let hasMessage: boolean;

    // delete messages
    for (const message of response.Messages) {

      const body = JSON.parse(message.Body);
      // console.log(`Sent Type: ${type}, ReceivedType: ${body.type}, CID: ${correlationId}, RCID: ${correlationId}`);
      hasMessage = type === body.type && correlationId === body.correlationId;

      if (hasMessage) {
        await new SQS({ apiVersion: '2012-11-05' })
          .deleteMessage({ QueueUrl: TEST_QUEUE_URL, ReceiptHandle: message.ReceiptHandle })
          .promise();
        break;
      }

    }

    expect(hasMessage).toBe(true);

  });

  test("StateMachine request", async () => {

    const stateMachineEvent = getStateMachineEvent();

    const lambda: CommonIOHandler<INPUT, INPUT> = async event => {
      expect(event.inputs[0]).toMatchObject(stateMachineEvent.payload);
      return event.inputs;
    };

    await withMiddleware(lambda)(stateMachineEvent, {} as Context);

  });

  test("StateMachine response", async () => {

    const stateMachineEvent = getStateMachineEvent();

    const lambda: CommonIOHandler<INPUT, INPUT> = async event => {
      return event.inputs;
    };

    const response = await withMiddleware(lambda)(stateMachineEvent, {} as Context);
    expect(response).toMatchObject(stateMachineEvent.payload);

  });

  test("ApiGateway request", async () => {

    const apiGatewayEvent = getApiGatewayEvent();

    const lambda: CommonIOHandler<INPUT, INPUT> = async event => {
      expect(event.inputs[0]).toBe(apiGatewayEvent.body);
      return event.inputs;
    };

    await withMiddleware(lambda)(apiGatewayEvent, {} as Context);

  });

  test("ApiGateway response", async () => {

    const apiGatewayEvent = getApiGatewayEvent();

    const lambda: CommonIOHandler<INPUT, INPUT> = async event => {
      return event.inputs;
    }

    const response = await withMiddleware(lambda)(apiGatewayEvent, {} as Context);
    expect(JSON.parse(response.body)).toMatchObject(apiGatewayEvent.body);

  });

  test("EventBridge request", async () => {

    const eventBridgeEvent = getEventBridgeEvent();

    const lambda: CommonIOHandler<INPUT, INPUT> = async event => {
      expect(event.inputs[0]).toBe(eventBridgeEvent.detail);
      return event.inputs;
    };

    await withMiddleware(lambda)(eventBridgeEvent, {} as Context);

  });

  /*
  
  test("AppSync input", async () => {

    const appSyncEventInput = getAppSyncEvent(true);

    const lambda: CommonIOHandler<Input, void> = async event => {
      event.inputs.forEach((input) => {
        const appSyncEventEquivalentInput = appSyncEventInput.arguments.input;
        expect(input.payload).toMatchObject(appSyncEventEquivalentInput);
        expect((input.payload as any).creator).toBe((appSyncEventInput.identity as AppSyncIdentityCognito).sub);
      });
    };

    await withMiddleware(lambda)(appSyncEventInput, {} as Context);

  });

  test("Appsync operation output", async () => {

    const appSyncEventInput = getAppSyncEvent(true);

    const lambda: CommonIOHandler<Input, void> = async () => {};

    const response = await withMiddleware(lambda)(appSyncEventInput, {} as Context);

    expect(response).toMatchObject({
      __typename: "OperationResponse",
      success: true,
      message: undefined
    });

  });

  test("AppSync output with returned response", async () => {

    const appSyncEventInput = getAppSyncEvent(true);

    const lambda: CommonIOHandler<Input, Input["payload"]> = async event => {
      return event.inputs[0].payload;
    }

    const response = await withMiddleware(lambda)(appSyncEventInput, {} as Context);
    expect(response).toMatchObject(appSyncEventInput.arguments.input);

  });

  // INTEGRATION test with withErrorResponse middleware
  test("AppSync output error response", async () => {

    const appSyncEventInput = getAppSyncEvent(true);

    const lambda: CommonIOHandler<Input, Input["payload"]> = async event => {
      throw new Error("Thrown");
    }

    const response = await (
      withMiddleware(lambda)
      .use(withErrorResponse())
    )(appSyncEventInput, {} as Context);

    expect(response).toMatchObject({
      __typename: 'ErrorResponse',
      type: ErrorTypes.InternalError,
      message: 'Something went wrong.'
    });

  });

  */

});