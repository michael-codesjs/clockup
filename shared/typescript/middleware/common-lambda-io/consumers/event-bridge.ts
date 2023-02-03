import middy from "@middy/core";
import { Context, EventBridgeEvent } from "aws-lambda";
import { EventBridge } from "aws-sdk";
import { CommonInput } from "../../../io/types/main";
import { eventBridgeClient } from "../../../lib/event-bridge";
import { configureEnviromentVariables } from "../../../utilities/functions";
import { CommonIOEvent, Consumer } from "../types";

const { EVENT_BUS_NAME } = configureEnviromentVariables();

export class CommonIoEventBridgeConsumer implements Consumer {

  async request(request: middy.Request<EventBridgeEvent<any, any>, any, Error, Context>): Promise<void> {

    let event: CommonIOEvent<any> = {
      inputs: [request.event.detail]
    };

    if(!request.internal) request.internal = {};
    request.internal.originalEvent = Object.assign({}, request.event);

    request.event = event as unknown as EventBridgeEvent<any, any>; // replace SQS event with CommonIOEvent

  }

  async response(request: middy.Request<EventBridgeEvent<any, any>, Array<Record<string, any>>, Error, Context>): Promise<void> {

    for (let index = 0; index < request.response.length; index++) {

      const commonIoEvent = request.event as unknown as CommonIOEvent<CommonInput<string, any>>;
      const { meta } = commonIoEvent.inputs[index];

      if (!meta) return console.log("No meta tags were included by the input producer.");

      if (meta.propagate) {

        const response = request.response[index] as CommonInput<string, any>;

        const putEventArgs: EventBridge.PutEventsRequest = {
          Entries: [{
            EventBusName: EVENT_BUS_NAME,
            Source: meta.source,
            DetailType: response.type,
            Detail: JSON.stringify(response)
          }],
        };

        await eventBridgeClient()
          .putEvents(putEventArgs)
          .promise();

      }

    }

  }

}