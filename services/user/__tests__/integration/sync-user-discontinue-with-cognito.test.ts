import Entities from "@entities";
import { Given, When, Repeat } from "@utilities/testing";

describe("Sync User Delete", () => {

	const userIsDisabled = async (username: string, password: string) => {
		try {
			await When.auth.signIn({ username, password }); // try to sign into disabled user
			return false; // false cause user was signed in successfully
		} catch (error: any) {
			return error.name === "NotAuthorizedException" && error.message === "User is disabled.";
		}
	};

	test("User was deleted from cognito", async () => {

		const user = await Given.user.authenticated();

		const instance = Entities.User(user);
		await instance.discontinue(); // discontinue user in dynamodb

		// repeat N times every T seconds until we get true from userIsDisabled
		const result = await Repeat.timedOnCondition({
			times: 10,
			duration: 100,
			call: async () => await userIsDisabled(instance.attributes.get("email"), user.password)
		});

		expect(result).toBe(true);

	});

});