import { ErrorTypes, User } from "shared/types/api";
import { chance } from "@utilities/constants";
import { Given, HandlerArguments, Then } from "@utilities/testing";
import { handler } from "../../functions/update-user";

describe("Update User", () => {

	it("Updates a users profile", async () => {

		const { id } = await Given.user.authenticated(); // create random user
		const { name, email } = Given.user.attributes(); // get attributes to update

		const { event, context } = HandlerArguments.user.update({ id, name, email }); // get payload for handler

		const updatedAtributes = { name, email, id, alarms: 0 };

		const lambdaResponse = await handler(event, context, () => { });
		console.log("Response:", lambdaResponse);
		Then(lambdaResponse).user(updatedAtributes); // check lambda response returns updated attribues

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