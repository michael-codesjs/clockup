import { SQSEvent } from "aws-lambda";
import { CommonIOEvent, Consumer } from "../types";

export class CommonIoSQSConsumer implements Consumer {

  async request(event: SQSEvent): Promise<void> {
    console.log("Event:", JSON.stringify(event));
    let commonIOEvent: CommonIOEvent<any>;
    for (const record of event.Records) {
      const body = JSON.parse(record.body);
      commonIOEvent.inputs.push(
        "Type" in body && body.Type === "Notification" ? JSON.parse(body.Message) : // event was piped into sqs from sns
          body
      );
    }
  }

  async response(responses: Array<Record<string,any>>): Promise<void> {
    for(const response of responses) {
      if("CID" in response && "replyTo" in response) {

      }
    }
  }

}