import middy from "@middy/core";
import SQS from "aws-sdk/clients/sqs"
import { SNSEvent, SNSEventRecord, SQSEvent, Context, AppSyncResolverEvent, AppSyncIdentityCognito } from "aws-lambda";
import { ErrorTypes } from "../../types/api";
import { chance } from "../../utilities/constants";
import { configureEnviromentVariables } from "../../utilities/functions";
import { commonLambdaIO } from "../common-lambda-io";
import { CommonIOHandler } from "../common-lambda-io/types";
import { errorResponse } from "../error-response";

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

    const lambda: CommonIOHandler<Input, Array<any>> = async event => {
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

    const lambda: CommonIOHandler<Input, Array<any>> = async event => {
      return event.inputs;
    };

    await withMiddleware(lambda)(sqsEvent, {} as Context);

    // get message which is supposed to be sent to the replyQueue(TEST_QUEUE);

    const response = await new SQS({ apiVersion: '2012-11-05' })
      .receiveMessage({
        QueueUrl: TEST_QUEUE_URL,
        MessageAttributeNames: ["CID", "Type"],
        WaitTimeSeconds: 20,
        MaxNumberOfMessages: 10
      })
      .promise();

    const Type = sqsEvent.Records[0].messageAttributes.Type.stringValue;
    const CID = sqsEvent.Records[0].messageAttributes.CID.stringValue;

    const hasMessage = response.Messages.some(message => {
      return Type === message.MessageAttributes.Type.StringValue && CID === message.MessageAttributes.CID.StringValue;
    });

    expect(hasMessage).toBe(true);

    // delete messages
    for (const message of response.Messages) {
      await new SQS({ apiVersion: '2012-11-05' })
        .deleteMessage({
          QueueUrl: TEST_QUEUE_URL,
          ReceiptHandle: message.ReceiptHandle
        })
        .promise();
    }

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