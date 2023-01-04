import middy from "@middy/core";
import { SNSEvent, SNSEventRecord, SQSEvent, SQSRecord } from "aws-lambda";
import { CommonIOEvent } from "./types";

/** Provides a common interface for receiving inputs from difference sources to a lambda function */
export const commonIO = <I extends Record<string, any>, R>(): middy.MiddlewareObj<CommonIOEvent<I>, R> => {

	const before: middy.MiddlewareFn<CommonIOEvent<I>, R> = async request => {

		const event = request.event as unknown as SNSEvent | SQSEvent;

		const isSNSEventRecord = (record: SNSEventRecord | SQSRecord): record is SNSEventRecord => "Sns" in record;
		const isSQSRecord = (record: SNSEventRecord | SQSRecord): record is SQSRecord => "eventSource" in record && record.eventSource === "aws:sqs";

		const commonIOEvent: CommonIOEvent<I> = {
			io: []
		};

		// TODO: refactor, don't like the IFs
		if (event.Records) {
			for (const record of event.Records) {
				if (isSNSEventRecord(record)) {
					commonIOEvent.io.push(JSON.parse(record.Sns.Message));
				} else if (isSQSRecord(record)) {
					const body = JSON.parse(record.body);
					commonIOEvent.io.push(
						"Type" in body && body.Type === "Notification" ? body.Message : // event was piped into sqs from sns
							body
					)
				} else {
					throw new Error("Unrecognized input source.");
				}
			}
		}

	};

	return {
		before
	};

};