import { OperationResponse } from "../../../../shared/typescript/types/api"
import { Given, When } from "../../../../shared/typescript/utilities/testing";

describe("Delete User", () => {
  
	it("Deletes a users account", async () => {

		const user = await Given.user.authenticated();

		const deleteResult = await When.user.delete(); // delete user e2e

		console.log("Delete Result:", deleteResult);

		/* expect((deleteResult as OperationResponse).success).toBe(true);

		const postDeleteDbRecord = await Given.user.byId(user.id);
		expect(postDeleteDbRecord.discontinued).toBe(true);
		*/

	});
	
});