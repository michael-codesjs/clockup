import middy from "@middy/core";
import { Consumers } from "./consumers";
import { CommonIOInputSources, Consumer } from "./types";

/** Provides a common interface for receiving and replying to inputs from various sources. */
export const commonLambdaIO = <I, R>(): middy.MiddlewareObj<CommonIOInputSources<I, R>, R> => {

	let consumer: Consumer;

	return {

		before: async request => {
			consumer = Consumers.consumer(request.event);
			await consumer.request(request);
		},

		onError: async request => consumer.error && await consumer.error(request),
		after: async request => consumer.response && await consumer.response(request)

	};


};