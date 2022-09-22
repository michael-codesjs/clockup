import { Given, HandlerArguments, Then } from "@utilities/testing";
import { handler } from "../../functions/update-user";


describe("Update User", () => {

	it("Updates a users details", async () => {

		const { id } = await Given.user.random(); // create random user
		const { name, email, entityType } = Given.user.attributes(); // get attributes to update

		const { event, context } = HandlerArguments.user.update({ id, name, email }); // get payload for handler

		const updatedAtributes = { name, email, id, entityType };

		const lambdaResponse = await handler(event, context, () => { });
		Then.user(lambdaResponse, updatedAtributes);

		const postUpdateRecord = await Given.user.byId(id);
		Then.user(postUpdateRecord, lambdaResponse);

	});

});