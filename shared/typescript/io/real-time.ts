import { EventBridge } from "aws-sdk";
import correlator from "correlation-id";
import { eventBridgeClient } from "../lib/event-bridge";
import { configureEnviromentVariables } from "../utilities/functions";
import { SendInputResponse } from "./types/main";
import { ASYNC_OPERATION_RESULT, Inputs } from "./types/real-time";

const { EVENT_BUS_NAME } = configureEnviromentVariables();

type BaseSendInputParams = {
  correlationId: string,
  source: string
};

type AsyncOperationResultParams = Pick<ASYNC_OPERATION_RESULT, "correlationId" | "payload"> & BaseSendInputParams;
type AsyncOperationResultResponse = Promise<SendInputResponse<EventBridge.PutEventsResponse>>;

/** Utility class for sending inputs to the real-time service. */
class RealTimeServiceIO {

  private constructor() { }
  static readonly instance = new RealTimeServiceIO();

  /** Sends a 'ASYNC_OPERATION_RESULT' to the real-time service. */
  async asyncOperationResult(params: AsyncOperationResultParams): AsyncOperationResultResponse {

    const correlationId = params.correlationId || correlator.getId();

    const { source, ...rest } = params;

    const input: ASYNC_OPERATION_RESULT = {
      ...rest,
      type: Inputs.ASYNC_OPERATION_RESULT,
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

export const realTime = RealTimeServiceIO.instance;