import middy from "@middy/core";
import { SNSEvent, SNSEventRecord, SQSEvent, Context } from "aws-lambda";
import { chance } from "../../utilities/constants";
import { commonLambdaIO } from "../common-lambda-io";
import { CommonIOHandler } from "../common-lambda-io/types";

describe("CommonServiceIO", () => {

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

})