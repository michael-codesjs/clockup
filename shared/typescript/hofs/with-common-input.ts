import { CommonIOEvent, CommonIOHandler } from "../middleware/common-lambda-io/types";

/** Generates a CommonIO handler that maps, applies and returns the result of a supplied function on each input. */
export const withCommonInput = <I extends Record<string, any>, R>(inputHandler: (input: I) => Promise<R>): CommonIOHandler<I, Awaited<R>> => (
  async (event: CommonIOEvent<I>): Promise<Array<Awaited<R>>> => {
    const responses: Array<Awaited<R>> = [];
    for (const input of event.inputs) {
      responses.push(await inputHandler(input));
    }
    return responses;
  }
);