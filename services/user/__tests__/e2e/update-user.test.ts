import { Given, Then, When } from "@utilities/testing";

describe("Edit User Profile", () => {

	it("Edits a users profile", async () => {

		const user = await Given.user.authenticated(); // create user e2e
		const { email, name } = Given.user.attributes(); // new user attributes
		const updatedProfile = await When.user.update({ email, name });

		Then.user_VS_user(updatedProfile, { ...user, name, email });

	});

});