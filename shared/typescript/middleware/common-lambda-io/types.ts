import { Context } from "aws-lambda";

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