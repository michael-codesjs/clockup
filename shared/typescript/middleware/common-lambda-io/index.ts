import middy from "@middy/core";
import { Consumers } from "./consumers.ts";
import { CommonIOInputSources, Consumer } from "./types";

/** Provides a common interface for receiving inputs from different sources(SQS,SNS,AppSync,API Gateway, EventBridge, MQ). */
export const commonLambdaIO = <I extends Record<string, any>, R>(): middy.MiddlewareObj<CommonIOInputSources<I, R>, R> => {

	let consumer: Consumer;

	const before: middy.MiddlewareFn<CommonIOInputSources<I, R>, R> = async request => {
		consumer = Consumers.consumer(request.event);
		await consumer.request(request);
	};

	const after: middy.MiddlewareFn<CommonIOInputSources<I, R>, R> = async request => {
		await consumer.response(request);
	}

	return {
		before,
		after
	};

};