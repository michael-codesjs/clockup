import middy from "@middy/core";
import { Context, SQSEvent } from "aws-lambda";
import { SQS } from "aws-sdk";
import { CommonInput } from "../../../io/types/main";
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

    for (let index = 0; index < request.response.length; index++) {

      const commonIoEvent = request.event as unknown as CommonIOEvent<CommonInput<string, any>>;
      const { meta } = commonIoEvent.inputs[index];

      if (!meta) return console.log("No meta tags were included by the input producer.");

      if (meta.replyTo) {

        const response = request.response[index];

        const sendMessageArgs = {
          MessageBody: JSON.stringify(response),
          QueueUrl: meta.replyTo
        }

        await this.sqsServiceObject
          .sendMessage(sendMessageArgs)
          .promise();

      }
      
    }

    request.response = null;

  }

}