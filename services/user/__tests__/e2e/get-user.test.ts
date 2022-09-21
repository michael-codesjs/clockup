import { Given, Then, When } from "@utilities/testing";

describe("Get User Profile", () => {

	it("gets users profile", async () => {
   
		const user = await Given.user.authenticated();
		const profile = await When.user.get();

		Then.user(user, profile!);
  
	});

});