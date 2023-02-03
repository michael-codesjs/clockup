
import { EventBridge } from "aws-sdk";
import correlator from "correlation-id";
import { eventBridgeClient } from "../lib/event-bridge";
import { configureEnviromentVariables } from "../utilities/functions";
import { DELETE, Inputs, UPDATE } from "./types/authentication";
import { SendInputResponse } from "./types/main";

const {
  AUTHENTITCATION_API_URL,
  EVENT_BUS_NAME
} = configureEnviromentVariables();

type BaseSendInputParams = {
  correlationId?: string,
  source: string
}

type OptionalUpdateParams = BaseSendInputParams;

type OptionalDeleteParams = BaseSendInputParams;

/** Utility class for sending inputs to the authentication service. */
class AuthenticationServiceIO {

  private constructor() { }
  static readonly instance = new AuthenticationServiceIO();

  /** Sends a 'UPDATE' input to the authentication service. */
  async update(params: Pick<UPDATE, "payload" | "meta"> & OptionalUpdateParams): Promise<SendInputResponse<EventBridge.PutEventsResponse>> {

    const correlationId = params.correlationId || correlator.getId();
    const { source, ...rest } = params;

    const input: UPDATE = {
      ...rest,
      type: Inputs.UPDATE,
      correlationId,
    };

    const putEventArgs: EventBridge.PutEventsRequest = {
      Entries: [{
        EventBusName: EVENT_BUS_NAME,
        Source: source,
        DetailType: input.type,
        Detail: JSON.stringify(input),
      }]
    };

    const response = await eventBridgeClient()
      .putEvents(putEventArgs)
      .promise();

    return {
      correlationId,
      response
    };

  }

  /** Sends a 'DELETE' input to authentication service. */
  async delete(params: Pick<DELETE, "payload" | "meta"> & OptionalDeleteParams): Promise<SendInputResponse<EventBridge.PutEventsResponse>> {

    const correlationId = params.correlationId || correlator.getId();

    const { source, ...rest } = params;

    const input: DELETE = {
      ...rest,
      type: Inputs.DELETE,
      correlationId
    };

    const putEventArgs: EventBridge.PutEventsRequest = {
      Entries: [{
        EventBusName: EVENT_BUS_NAME,
        Source: source,
        DetailType: input.type,
        Detail: JSON.stringify(input),
      }]
    };

    const response = await eventBridgeClient()
      .putEvents(putEventArgs)
      .promise();

    return {
      correlationId,
      response: response
    };

  }

}

export const authenticationServiceIO = AuthenticationServiceIO.instance;