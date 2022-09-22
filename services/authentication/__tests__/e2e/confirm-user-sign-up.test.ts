import { chance } from "@utilities/constants";
import { Given, Then, When } from "@utilities/testing";

describe("Confirm User Sign", () => {

	it("Confirms the user signs-up", async () => {

		const { name, email } = Given.user.attributes(); // get random user attributes
		const password = chance.string({ length: 20, numeric: true, symbols: true });

		const user = await When.auth.signUp({ name, email, password }); // sign up user e2e

		const dbRecord = await Given.user.byId(user.id); // get user record from the table

		Then.user(dbRecord,user); // test attributes from cognito against record in our table

	});

});