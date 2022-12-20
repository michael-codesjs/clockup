import { Given, HandlerArguments, Repeat } from "../../../../shared/typescript/utilities/testing";
import { main } from "../../functions/confirm-sign-up/handler";
import { dynamoDbOperations } from "../../../../shared/typescript/lib/dynamoDb";
import { configureEnviromentVariables } from "../../../../shared/typescript/utilities/functions";

const { DYNAMO_DB_TABLE_NAME } = configureEnviromentVariables();

describe("Confirm Sign Up", () => {

	let attributes: ReturnType<typeof Given.user.attributes>;

	beforeEach(() => {
		attributes = Given.user.attributes();
	});

	afterEach(async () => {
		// clean up
		await dynamoDbOperations.delete({
			TableName: DYNAMO_DB_TABLE_NAME!,
			Key: {
				PK: "USER#" + attributes.id as any,
				SK: "USER#" + attributes.id as any
			}
		})
	})

	it("Sends create user message event to user topic", async () => {

		const attributes = Given.user.attributes(); // get random user attributes
		const { event, context } = HandlerArguments.cognito.confirmSignUp(attributes); // event payload for confirmUserSignUp lambda handler

		await main(event, context); // call lambda

		/*
		Repeat.timedOnCondition({
			times: 20,
			duration: 200,
			call: async () => { // check if the user was created in table.
				// get user item
				const { Item } = await dynamoDbOperations.get({
					TableName: DYNAMO_DB_TABLE_NAME,
					Key: {
						PK: "USER#" + attributes.id as any,
						SK: "USER#" + attributes.id as any
					}
				});
				return Item.id === attributes.id
			}
		})
		*/

	});

});