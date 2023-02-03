import { AppSyncResolverEvent, Context, SNSEvent, SQSEvent, APIGatewayProxyEvent, EventBridgeEvent } from "aws-lambda";
import middy from "@middy/core";
import { CommonInput } from "../../io/types/main";

export enum InputSource {
  SNS = "SNS",
  SQS = "SQS",
  AppSync = "AppSync",
  ApiGateway = "ApiGateway"
}

export type CommonIOEvent<I extends Record<string, any>> = {
  inputs: Array<I>
};

type BaseCommonInput = CommonInput<string, any>;
type CommonIOHandlerResponse<R extends BaseCommonInput> = Promise<Array<Omit<R, "correlationId" | "meta">>>;

/** 'CommonIOHandler' type definition */
export type CommonIOHandler<I extends BaseCommonInput, R extends BaseCommonInput> = (event: CommonIOEvent<I>, context?: Context) => CommonIOHandlerResponse<R>;

export type CommonInputSources<I, R> = SNSEvent | SQSEvent | AppSyncResolverEvent<I, R> | StateMachineEvent<I> | APIGatewayProxyEvent | EventBridgeEvent<any, any>;

export interface Consumer {
  request(request: middy.Request<CommonInputSources<any, any>, any, Error, Context>): Promise<void>;
  response?(request: middy.Request<CommonInputSources<any, any>, any, Error, Context>): Promise<void>;
  error?(request: middy.Request<CommonInputSources<any, any>, any, Error, Context>): Promise<void>;
}

export type StateMachineEvent<P extends Record<string, any> = Record<string, any>> = {
  source: "StateMachine",
  attributes: {
    Type: string,
    correlationId?: string,
  }
  payload: P
}