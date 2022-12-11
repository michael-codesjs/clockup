import { OperationResponse } from "shared/types/api";
import { Given, When } from "@utilities/testing";

describe("Delete User", () => {
  
	it("Deletes a users account", async () => {

		const user = await Given.user.authenticated();

		const deleteResult = await When.user.delete(); // delete user e2e

		expect((deleteResult as OperationResponse).success).toBe(true);

		const postDeleteDbRecord = await Given.user.byId(user.id);
		expect(postDeleteDbRecord.discontinued).toBe(true);

	});
	
});