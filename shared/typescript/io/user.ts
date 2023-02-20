import { EventBridge } from "aws-sdk";
import correlator from "correlation-id";
import { eventBridgeClient } from "../lib/event-bridge";
import { configureEnviromentVariables } from "../utilities/functions";
import { apiGatewaySignedFetch } from './api-gateway-signed-fetch';
import { SendInputResponse } from "./types/main";
import { CONTINUE, CONTINUED, CREATABLES_CLEAN_UP, CREATE, CREATED, DELETION_SETTLED, DISCONTINUE, Inputs } from "./types/user";

const { USER_API_URL, EVENT_BUS_NAME } = configureEnviromentVariables();

type BaseSendInputParams = {
  correlationId?: string,
  source: string
};

type AsyncSendInputResponse = Promise<SendInputResponse<EventBridge.PutEventsRequest>>;

type OptionalCreatedParams = BaseSendInputParams;

type DiscontinueParams = Pick<DISCONTINUE, "payload" | "meta"> & BaseSendInputParams;
type CreatablesCleanUpParams = Pick<CREATABLES_CLEAN_UP, "payload" | "meta"> & BaseSendInputParams;

type OptionalContinueParams<S extends boolean> = BaseSendInputParams & { sync: S };

type CONTINUE_RESPONSE<S extends boolean> = Promise<SendInputResponse<
  S extends true ? EventBridge.PutEventsResponse : CONTINUED
>>;

type DeletionSettledParams = Pick<DELETION_SETTLED, "payload" | "meta"> & BaseSendInputParams;

// TODO: refactor, lot of DRY code.
/** Utility class for sending inputs to the user service. */
class UserServiceIO {

  private constructor() { }
  static readonly instance = new UserServiceIO();

  /** Sends a 'CREATE' input to the user service via it's API. Is a synchronous operation so expect a "CREATED" response. */
  async create(params: Pick<CREATE, "correlationId" | "payload">): Promise<CREATED> {

    const body = JSON.stringify({ type: Inputs.CREATE, ...params });

    const response = await apiGatewaySignedFetch(USER_API_URL, {
      method: 'post',
      body: body,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json = await response.json();
    if (response.status !== 200) throw new Error("");

    return json;

  }

  /** Sends a 'USER_CREATED' input to the event bus. */
  async created(params: Pick<CREATED, "payload" | "meta"> & OptionalCreatedParams): Promise<any> {

    const correlationId = params.correlationId || correlator.getId();

    const { source, ...rest } = params;

    const input: CREATED = {
      ...rest,
      type: Inputs.CREATED,
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

  /** Sends a 'USER_DISCONTINUE' input to the user service. */
  async discontinue(params: DiscontinueParams): AsyncSendInputResponse {

    const correlationId = params.correlationId || correlator.getId();

    const { source, ...rest } = params;

    const input: DISCONTINUE = {
      ...rest,
      type: Inputs.DISCONTINUE,
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
      correlationId: input.correlationId,
      response: response
    };

  }

  /** Sends a 'USER_CONTINUE' input to the user service. */
  async continue<S extends boolean>(params: Pick<CONTINUE, "payload" | "meta"> & OptionalContinueParams<S>): CONTINUE_RESPONSE<S> {

    const correlationId = params.correlationId || correlator.getId();

    const { source, sync, ...rest } = params;

    const input: CONTINUE = {
      ...rest,
      type: Inputs.CONTINUE,
      correlationId
    };

    if (sync) return await this.continueSync(input, source);
    else return await this.continueAsync(input, source);

  }

  private async continueSync(input: CONTINUE, source: string) {

    const response = await apiGatewaySignedFetch(USER_API_URL, {
      method: 'post',
      body: JSON.stringify(input),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const json = await response.json();
    if (response.status !== 200) throw new Error("");

    return json;

  }

  private async continueAsync(input: CONTINUE, source: string): Promise<SendInputResponse<EventBridge.PutEventsResponse>> {

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
      correlationId: input.correlationId,
      response: response
    };

  }

  async creatablesCleanUp(params: CreatablesCleanUpParams): AsyncSendInputResponse {

    const correlationId = params.correlationId || correlator.getId();

    const { source, ...rest } = params;

    const input: CREATABLES_CLEAN_UP = {
      ...rest,
      type: Inputs.CREATABLES_CLEAN_UP,
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

  async deletionSettled(params: DeletionSettledParams): AsyncSendInputResponse {

    const correlationId = params.correlationId || correlator.getId();

    const { source, ...rest } = params;

    const input: DELETION_SETTLED = {
      ...rest,
      type: Inputs.DELETION_SETTLED,
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

export const userServiceIO = UserServiceIO.instance;