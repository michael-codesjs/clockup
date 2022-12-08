import { Given, Then, When } from "@utilities/testing";

describe("Edit User Profile", () => {

	it("Edits a users profile", async () => {

		const user = await Given.user.authenticated(); // create user e2e
		const { email, name } = Given.user.input(); // new user attributes
		const updatedProfile = await When.user.update({ email, name });

		Then(updatedProfile).user({ ...user, name, email, alarms: 0 });

	});

});