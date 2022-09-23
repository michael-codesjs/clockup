import { DynamoDBStreamEvent } from "aws-lambda";
import { AttributeValue } from "aws-sdk/clients/dynamodb";
import { context } from "./context";

type Params = {
  Old?: Record<string, any>,
  New?: Record<string, any>
};

class StreamEventsHandlerArguments {

	private constructor() {}
	static readonly instance = new StreamEventsHandlerArguments();

	private turnObjectToAttributeValue(object: Record<string,AttributeValue>) {
		return Object.entries(object)
			.reduce((collective, attribute) => {
				const [key, value] = attribute;
				if(typeof value === "string") {
					collective[key] = {
						S: value
					};
				}
				return collective;
			}, {});
	}

	dynamoDb(params:Params) {

		const { Old, New } = params;

		// event payload will grow as i test more things
		const event:DynamoDBStreamEvent = {
			Records: [
				{
					dynamodb: {
						OldImage: Old && this.turnObjectToAttributeValue(Old),
						NewImage: New && this.turnObjectToAttributeValue(New)
					}
				}
			]
		};

		return {
			event,
			context: context()
		};

	}

}

export const Stream = StreamEventsHandlerArguments.instance;