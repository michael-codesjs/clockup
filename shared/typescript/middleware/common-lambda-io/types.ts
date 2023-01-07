import { AppSyncResolverEvent, Context, SNSEvent, SQSEvent } from "aws-lambda";
import middy from "@middy/core";

export enum InputSource {
  SNS = "SNS",
  SQS = "SQS",
  AppSync = "AppSync"
} 

export type CommonIOEvent<I extends Record<string, any>> = {
  inputs: Array<I>
};

export type CommonIOHandler<I extends Record<string, any>, R> = (event: CommonIOEvent<I>, context: Context) => Promise<R>;

export type CommonIOInputSources<I,R> = SNSEvent | SQSEvent | AppSyncResolverEvent<I, R>;

export interface Consumer {
  request(request: middy.Request<CommonIOInputSources<any,any>, any, Error, Context>): Promise<void>;
  response(request: middy.Request<CommonIOInputSources<any,any>, any, Error, Context>): Promise<void>;
}