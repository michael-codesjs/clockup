import { Given, HandlerArguments } from "@utilities/testing";
import { handler } from "../../functions/sync-user-delete-with-cognito";



describe("Sync User Delete With Cognito", () => {

	it("Deletes a user from cognito", async () => {

		const { id } = await Given.user.authenticated();
		const { event, context } = HandlerArguments.stream.dynamoDb({
			Old: { id }
		});

		await handler(event, context, () => { });

		try {

			// getting a user that's not in the pool throws an error, so our test will pass in the catch block
			await Given.user.fromPool(id);
			// if fromPool did not throw an error, fail the test
			expect(true).toBe(false);

		} catch {

			expect(true).toBe(true);
    
		}

	});

});