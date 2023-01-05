import middy from "@middy/core";
import { SNSEvent, SNSEventRecord, SQSEvent, Context, AppSyncResolverEvent, AppSyncIdentityCognito } from "aws-lambda";
import { ErrorTypes } from "../../types/api";
import { chance } from "../../utilities/constants";
import { commonLambdaIO } from "../common-lambda-io";
import { CommonIOHandler } from "../common-lambda-io/types";
import { withErrorResponse } from "../with-error-response";

describe("CommonLambdaIO", () => {

  let type: string;
  let payload: {
    stringAttribute: string,
    numberAttribute: number,
    booleanAttribute: boolean,
    arrayAttribute: Array<any>,
    objectAttribute: Record<string, any>
  };

  type Input = {
    type: typeof type,
    payload: typeof payload
  };

  beforeEach(() => {
    type = chance.string({ alpha: true, casing: "upper", numeric: false, symbols: false });
    payload = {
      stringAttribute: chance.string(),
      numberAttribute: chance.integer(),
      booleanAttribute: chance.bool(),
      arrayAttribute: Array(chance.integer({ min: 1, max: 10 })).fill(null).map(() => chance.string()),
      objectAttribute: {
        [chance.string()]: chance.string()
      }
    };
  });

  const generateInput = () => ({
    type: chance.string({ alpha: true, casing: "upper", numeric: false, symbols: false }),
    payload: {
      stringAttribute: chance.string(),
      numberAttribute: chance.integer(),
      booleanAttribute: chance.bool(),
      arrayAttribute: Array(chance.integer({ min: 1, max: 10 })).fill(null).map(() => chance.string()),
      objectAttribute: {
        [chance.string()]: chance.string()
      }
    }
  })

  const getSNSEvent = (): SNSEvent => ({
    Records: Array(chance.integer({ min: 1, max: 10 })).fill(null).map(() => {
      const message = generateInput();
      return {
        EventVersion: "1",
        EventSubscriptionArn: chance.string(),
        EventSource: "aws:sns",
        Sns: {
          Message: JSON.stringify(message),
          MessageAttributes: { type: message.type },
          MessageId: chance.fbid(),
          Signature: chance.string(),
        }
      } as unknown as SNSEventRecord
    })
  });

  const getSQSEvent = (piped = false): SQSEvent => ({
    Records: Array(chance.integer({ min: 1, max: 10 })).fill(null).map(() => {
      const input = generateInput();
      return {
        messageId: chance.fbid(),
        eventSource: "aws:sqs",
        attributes: {},
        body: JSON.stringify(
          piped ? { Type: "Notification", Message: JSON.stringify(input) } : input
        )
      } as unknown as SQSEvent["Records"][number];
    })
  });

  const getAppSyncEvent = (inInput = true): AppSyncResolverEvent<any, any> => {
    const input = generateInput().payload;
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

  test("Piped SQS input from SNS", () => {

    const sqsEvent = getSQSEvent(true);

    const lambda: CommonIOHandler<Input, void> = async event => {
      event.inputs.forEach((input, index) => {
        const sqsEventEquivalentInput = JSON.parse(
          JSON.parse(sqsEvent.Records[index].body).Message
        );
        expect(input).toMatchObject(sqsEventEquivalentInput);
      });
    };

    withMiddleware(lambda)(sqsEvent, {} as Context);

  });
  
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

});