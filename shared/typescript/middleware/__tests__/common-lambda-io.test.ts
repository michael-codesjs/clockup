import middy from "@middy/core";
import { AppSyncResolverEvent, Context, SNSEvent, SNSEventRecord, SQSEvent, APIGatewayProxyEvent } from "aws-lambda";
import SQS from "aws-sdk/clients/sqs";
import { ErrorResponse, ErrorTypes } from "../../types/api";
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

  const generateInput = () => ({
    stringAttribute: chance.string(),
    numberAttribute: chance.integer(),
    booleanAttribute: chance.bool(),
    arrayAttribute: Array(chance.integer({ min: 1, max: 10 })).fill(null).map(() => chance.string()),
    objectAttribute: {
      [chance.string()]: chance.string()
    }
  });

  type Input = ReturnType<typeof generateInput>;

  const getSNSEvent = (): SNSEvent => ({
    Records: Array(chance.integer({ min: 1, max: 10 })).fill(null).map(() => {
      const message = generateInput();
      return {
        EventVersion: "1",
        EventSubscriptionArn: chance.string(),
        EventSource: "aws:sns",
        Sns: {
          Message: JSON.stringify(message),
          MessageAttributes: { type },
          MessageId: chance.fbid(),
          Signature: chance.string(),
        }
      } as unknown as SNSEventRecord
    })
  });

  const getSQSEvent = (reply: boolean = false): SQSEvent => ({
    Records: Array(chance.integer({ min: 1, max: reply ? 1 : 10 })).fill(null).map(() => {
      const input = generateInput();
      const attributes: SQSEvent["Records"][number]["messageAttributes"] = reply ? {
        Type: {
          dataType: "String",
          stringListValues: [],
          stringValue: chance.word().toUpperCase()
        },
        CID: {
          dataType: "String",
          stringListValues: [],
          stringValue: input.stringAttribute
        },
        ReplyTo: {
          dataType: "String",
          stringListValues: [],
          stringValue: TEST_QUEUE_URL
        }
      } : {};
      return {
        messageId: chance.fbid(),
        eventSource: "aws:sqs",
        messageAttributes: attributes,
        attributes: {},
        body: JSON.stringify(input)
      } as unknown as SQSEvent["Records"][number];
    })
  });

  const getStateMachineEvent = (): StateMachineEvent<Input> => ({
    source: "StateMachine",
    attributes: {
      Type: "CREATE",
      CID: chance.fbid()
    },
    payload: generateInput()
  });

  const getApiGatewayEvent = (): APIGatewayProxyEvent => {
    const input = generateInput();
    return {
      body: JSON.stringify(input),
      httpMethod: "GET",
      headers: {},
      path: "/"
    } as APIGatewayProxyEvent;
  }

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

    const lambda: CommonIOHandler<Input, any> = async event => {
      event.inputs.forEach((input, index) => {
        const sqsEventEquivalentInput = JSON.parse(sqsEvent.Records[index].body)
        expect(input).toMatchObject(sqsEventEquivalentInput);
      });
      return event.inputs;
    };

    await withMiddleware(lambda)(sqsEvent, {} as Context);

  });

  test("SQS response", async () => {

    const sqsEvent = getSQSEvent(true);

    const lambda: CommonIOHandler<Input, any> = async event => {
      return event.inputs;
    };

    await withMiddleware(lambda)(sqsEvent, {} as Context);

    // get message which is supposed to be sent to the replyQueue(TEST_QUEUE);

    const response = await new SQS({ apiVersion: '2012-11-05' })
      .receiveMessage({
        QueueUrl: TEST_QUEUE_URL,
        MessageAttributeNames: ["CID", "Type"],
        WaitTimeSeconds: 0,
      })
      .promise();

    const Type = sqsEvent.Records[0].messageAttributes.Type.stringValue;
    const CID = sqsEvent.Records[0].messageAttributes.CID.stringValue;

    let hasMessage: boolean;

    // delete messages
    for (const message of response.Messages) {
      hasMessage = Type === message.MessageAttributes.Type.StringValue && CID === message.MessageAttributes.CID.StringValue;
      if (hasMessage) {
        await new SQS({ apiVersion: '2012-11-05' })
          .deleteMessage({
            QueueUrl: TEST_QUEUE_URL,
            ReceiptHandle: message.ReceiptHandle
          })
          .promise()
        break;
      }
    }

    expect(hasMessage).toBe(true);

  });

  test("StateMachine request", async () => {

    const stateMachineEvent = getStateMachineEvent();

    const lambda: CommonIOHandler<Input, any> = async event => {
      expect(event.inputs[0]).toMatchObject(stateMachineEvent.payload);
      return event.inputs;
    };

    await withMiddleware(lambda)(stateMachineEvent, {} as Context);

  });

  test("StateMachine response", async () => {

    const stateMachineEvent = getStateMachineEvent();

    const lambda: CommonIOHandler<Input, Input> = async event => {
      return event.inputs;
    };

    const response = await withMiddleware(lambda)(stateMachineEvent, {} as Context);
    expect(response).toMatchObject(stateMachineEvent.payload);

  });


  test("StateMachine error response", async () => {

    const stateMachineEvent = getStateMachineEvent();
    const errorMessage = chance.sentence();

    const lambda: CommonIOHandler<Input, ErrorResponse> = async (event) => {
      return [{
        __typename: "ErrorResponse",
        type: ErrorTypes.InternalError,
        message: errorMessage,
        code: chance.integer({ min: 100, max: 1000 })
      }];
    };

    try {
      await withMiddleware(lambda)(stateMachineEvent, {} as Context);
      throw new Error("Expeting state machine consumer to re-throw the ErrorResponse graphql entity.");
    } catch (error: any) {
      expect(error.__typename).toBe("ErrorResponse")
    }

  });

  test("ApiGateway request", async () => {

    const apiGatewayEvent = getApiGatewayEvent();
    
    const lambda: CommonIOHandler<Input, null> = async event => {
      expect(event.inputs[0]).toBe(apiGatewayEvent.body);
      return null;
    };

    await withMiddleware(lambda)(apiGatewayEvent, {} as Context);

  });

  test("ApiGateway response", async () => {

    const apiGatewayEvent = getApiGatewayEvent();

    const lambda: CommonIOHandler<Input, Input> = async event => {
      return event.inputs;
    }

    const response = await withMiddleware(lambda)(apiGatewayEvent, {} as Context);
    expect(response[0]).toBe(apiGatewayEvent.body);

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