import { AppSyncResolverEvent, Context, SNSEvent, SQSEvent } from "aws-lambda";

export enum InputSource {
  SNS = "SNS",
  SQS = "SQS",
  AppSync = "AppSync"
} 

export type CommonIOEvent<I extends Record<string, any>> = {
  inputs: Array<I>,
  type: InputSource,
};

export type CommonIOHandler<I extends Record<string, any>, R> = (event: CommonIOEvent<I>, context: Context) => Promise<R>;

export type AllEventTypes<I,R> = SNSEvent | SQSEvent | AppSyncResolverEvent<I, R>;

export interface Consumer {
  request(event: AllEventTypes<any, any>): Promise<void>;
  response(response: Array<Record<string, any>> | Record<string, any>): Promise<void>;
}