import middy from "@middy/core";
import { SNSEvent, SNSEventRecord, SQSEvent, SQSRecord, AppSyncResolverEvent, AppSyncIdentityCognito } from "aws-lambda";
import { OperationResponse } from "../../types/api";
import { isLiteralObject } from "../../utilities/functions";
import { AllEventType, CommonIOEvent, InputSource } from "./types";

/** Provides a common interface for receiving inputs from difference sources to a lambda function */
export const commonLambdaIO = <I extends Record<string, any>, R>(): middy.MiddlewareObj<AllEventType<I,R>, R> => {

	const before: middy.MiddlewareFn<AllEventType<I,R>, R> = async request => {

		const event = request.event as unknown as SNSEvent | SQSEvent | AppSyncResolverEvent<I, R>;

		const isSNSEventRecord = (record: SNSEventRecord | SQSRecord): record is SNSEventRecord => "Sns" in record;
		const isSQSRecord = (record: SNSEventRecord | SQSRecord): record is SQSRecord => "eventSource" in record && record.eventSource === "aws:sqs";
		const isAppSyncEvent = (event: SNSEvent | SQSEvent | AppSyncResolverEvent<I, R>): event is AppSyncResolverEvent<I, R> => {
			return (
				["arguments", "prev", "stash", "identity", "source"]
					.every(key => Boolean(event[key]))
			)
		};

		const commonIOEvent: CommonIOEvent<I> = {
			inputs: [],
		} as CommonIOEvent<I>;

		// TODO: refactor, don't like the IFs
		if ("Records" in event && event.Records) {
			for (const record of event.Records) {
				if (isSNSEventRecord(record)) {
					commonIOEvent.inputs.push(JSON.parse(record.Sns.Message));
				} else if (isSQSRecord(record)) {
					const body = JSON.parse(record.body);
					commonIOEvent.inputs.push(
						"Type" in body && body.Type === "Notification" ? JSON.parse(body.Message) : // event was piped into sqs from sns
							body
					)
				} else {
					throw new Error("Unrecognized input source.");
				}
			}
		} else if (isAppSyncEvent(event)) {
			let input = "input" in event.arguments ? event.arguments.input : event.arguments;
			input.creator = (event.identity as AppSyncIdentityCognito).sub;
			commonIOEvent.inputs.push({
				payload: input
			} as unknown as I);
			commonIOEvent.type = InputSource.AppSync;
		}

		request.event = commonIOEvent as unknown as AllEventType<I,R>;

	};

	const after: middy.MiddlewareFn<AllEventType<I,R>, R> = async request => {

		switch ((request.event as unknown as CommonIOEvent<I>).type) {
			case InputSource.AppSync:
				request.response = request.response && isLiteralObject(request.response) ? request.response : {
					__typename: "OperationResponse",
					success: true,
					message: request.response
				} as R;
				break;
			default:
				request.response = null
		}

	}

	return {
		before,
		after
	};

};