import { CommonIOEvent, CommonIOHandler } from "../middleware/common-lambda-io/types";

/** Generates a CommonIO handler that maps, applies and returns result of a supplied function on each input. */
export const withCommonInput = <I extends Record<string, any>, R>(inputHandler: (input: I) => R | Promise<R>): CommonIOHandler<I, R> => {
  return async (event: CommonIOEvent<I>): Promise<Array<R>> => {
    const responses: Array<R> = [] as Array<R>;
    for (const input of event.inputs) {
      responses.push(await inputHandler(input));
    }
    return responses;
  }
};