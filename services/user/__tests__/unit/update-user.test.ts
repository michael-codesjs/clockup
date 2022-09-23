import { Given, HandlerArguments, Then } from "@utilities/testing";
import { handler } from "../../functions/update-user";


describe("Update User", () => {

	it("Updates a users details", async () => {

		const { id } = await Given.user.authenticated(); // create random user
		const { name, email } = Given.user.attributes(); // get attributes to update

		const { event, context } = HandlerArguments.user.update({ id, name, email }); // get payload for handler

		const updatedAtributes = { name, email, id };

		const lambdaResponse = await handler(event, context, () => { });
		Then.user_VS_user(lambdaResponse, updatedAtributes); // check lambda response returns updated attribues

		const postUpdateRecord = await Given.user.byId(id); // get record after update
		Then.user_VS_user(postUpdateRecord, lambdaResponse); // test record againsts lambda response which has already been tasted to match new attributes

		// check if attributes were updated in cognito
		const poolRecord = await Given.user.fromPool(id);
		Then.poolUser_VS_user(poolRecord as any, postUpdateRecord); // test result from cognito user pool against updated user record in our table

	});

});