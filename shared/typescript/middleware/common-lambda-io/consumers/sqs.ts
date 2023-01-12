import middy from "@middy/core";
import { Context, SQSEvent } from "aws-lambda";
import { SQS } from "aws-sdk";
import { CommonIOEvent, Consumer } from "../types";

export class CommonIoSQSConsumer implements Consumer {

  private get sqsServiceObject() {
    return new SQS({ apiVersion: '2012-11-05' });
  }

  async request(request: middy.Request<SQSEvent, any, Error, Context>): Promise<void> {

    let event: CommonIOEvent<any> = {
      inputs: []
    }

    for (const record of request.event.Records) {
      const body = JSON.parse(record.body);
      event.inputs.push(
        // "Type" in body && body.Type === "Notification" ? JSON.parse(body.Message) : // event was piped into sqs from sns
        body
      );
    }

    request.internal = {
      originalEvent: Object.assign({}, request.event)
    };

    request.event = event as unknown as SQSEvent; // replace SQS event with CommonIOEvent

  }

  async response(request: middy.Request<SQSEvent, Array<Record<string, any>>, Error, Context>): Promise<void> {

    const originalEvent = request.internal.originalEvent as SQSEvent;

    for (let index = 0; index < request.response.length; index++) {

      const originalRecord = originalEvent.Records[index];
      const response = request.response[index];

      if ("ReplyTo" in originalRecord.messageAttributes && "CID" in originalRecord.messageAttributes) {

        const Type = originalRecord.messageAttributes.Type.stringValue;
        const CID = originalRecord.messageAttributes.CID.stringValue;
        const ResponseQueueURL = originalRecord.messageAttributes.ReplyTo.stringValue;

        await this.sqsServiceObject
          .sendMessage({
            MessageAttributes: {
              Type: {
                DataType: "String",
                StringValue: Type
              },
              CID: {
                DataType: "String",
                StringValue: CID
              }
            },
            MessageBody: JSON.stringify(response),
            QueueUrl: ResponseQueueURL
          })
          .promise();

      }
    }

    request.response = null;

  }

}