import { Given, When } from "@utilities/testing";

describe("Delete User", () => {
  
	it("Deletes a users account", async () => {

		const user = await Given.user.authenticated();

		const preDeleteRecord = await Given.user.byId(user.id); // check if we actually created the user
		expect(preDeleteRecord).toBeTruthy(); // we only care if a record exists so a truthy test should be ok

		const deleteResult = await When.user.delete(); // delete user e2e

		expect(deleteResult).toBe(true);

		const postDeleteDbRecord = await Given.user.byId(user.id); // get user record from the table(should not exist tho)
		expect(postDeleteDbRecord).toBe(null);

	});
});