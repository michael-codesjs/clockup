import { ErrorTypes, User } from "@local-types/api";
import { chance } from "@utilities/constants";
import { Given, HandlerArguments, Then } from "@utilities/testing";
import { handler } from "../../functions/update-user";

describe("Update User", () => {

	it("Updates a users details", async () => {

		const { id } = await Given.user.authenticated(); // create random user
		const { name, email } = Given.user.attributes(); // get attributes to update

		const { event, context } = HandlerArguments.user.update({ id, name, email }); // get payload for handler

		const updatedAtributes = { name, email, id, alarms: 0 };

		const lambdaResponse = await handler(event, context, () => { });
		Then(lambdaResponse).user(updatedAtributes); // check lambda response returns updated attribues

		const postUpdateRecord = await Given.user.byId(id); // get record after update
		Then(postUpdateRecord).user(lambdaResponse); // test record againsts lambda response which has already been tasted to match new attributes

		// check if attributes were updated in cognito
		const poolRecord = await Given.user.fromPool(id);
		Then({ ...poolRecord, alarm: 0 }).user(postUpdateRecord); // test result from cognito user pool against updated user record in our table

	});

	it("Fails with user malfomed input error when trying to update a user that does not exist", async () => {

		const id = chance.fbid();
		const { name } = Given.user.attributes(); // get attributes to update
		const { event, context } = HandlerArguments.user.update({ id, name, }); // get payload for handler

		const lambdaResponse = await handler(event, context, () => { });
		expect(lambdaResponse).toMatchObject({
			__typename: "ErrorResponse",
			type: ErrorTypes.NotFound,
		});

	});

});