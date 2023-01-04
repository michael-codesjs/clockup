import { Context } from "aws-lambda";

export type CommonIOEvent<I extends Record<string, any>> = {
  io: Array<I>
};

export type CommonIOHandler<I extends Record<string, any>, R> = (event: CommonIOEvent<I>, context: Context) => Promise<R>;