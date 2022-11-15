import { Given, HandlerArguments } from "@utilities/testing";
import { handler } from "../../functions/delete-user";

describe("Delete User", () => {

	it("Deletes a user", async () => {

		const user = await Given.user.authenticated();

		const { event, context } = HandlerArguments.user.delete(user.id); // get payload for handler

		const lambdaResponse = await handler(event, context, () => {});
		expect(lambdaResponse).toBeTruthy();

		const postDeleteRecord = await Given.user.byId(user.id);
		expect(postDeleteRecord).toBe(null);

	});

});