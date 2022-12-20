import { Given, HandlerArguments, When } from "@utilities/testing";
import { handler } from "../../functions/sync-user-discontinue-with-cognito";

describe("Sync User Delete With Cognito", () => {

	it("Disables a user in cognito user pool", async () => {

		const { id, email, password } = await Given.user.authenticated();
		const { event, context } = HandlerArguments.stream.dynamoDb({
			Old: { id }
		});

		await handler(event, context, () => { });

		try {
			await When.auth.signIn({ username: email, password }); // should fail, can not log into disabled user acconunt.
			throw new Error("Was expecting sign-in to fail");
		} catch(error:any) {
			console.log("Error", error);
			expect(error.name).toBe("NotAuthorizedException");
			expect(error.message).toBe("User is disabled.");
		}

	});

});