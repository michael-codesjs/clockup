import middy from "@middy/core";
import { Context, SQSEvent } from "aws-lambda";
import { CommonIOEvent, Consumer, StateMachineEvent } from "../types";

export class CommonIoStateMachineConsumer implements Consumer {

  async request(request: middy.Request<StateMachineEvent, any, Error, Context>): Promise<void> {

    let event: CommonIOEvent<any> = {
      inputs: Array.from(request.event.payload)
    }

    request.internal = {
      originalEvent: Object.assign({}, request.event)
    };

    request.event = event as unknown as StateMachineEvent; // replace StateMachine event with CommonIOEvent

  }

  async response(request: middy.Request<SQSEvent, Array<Record<string, any>>, Error, Context>): Promise<void> {

  }

}