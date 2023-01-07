import middy from "@middy/core";
import { Consumers } from "./consumers.ts";
import { AllEventTypes, Consumer } from "./types";

/** Provides a common interface for receiving inputs from different sources to a lambda function */
export const commonLambdaIO = <I extends Record<string, any>, R>(): middy.MiddlewareObj<AllEventTypes<I, R>, R> => {

	let consumer: Consumer;

	const before: middy.MiddlewareFn<AllEventTypes<I, R>, R> = async request => {
		consumer = Consumers.consumer(request.event);
		await consumer.request(request.event);
	};

	const after: middy.MiddlewareFn<AllEventTypes<I,R>, R> = async request => {
		await consumer.response(request.response);
	}

	return {
		before,
		after
	};

};