import { AsyncOperationResponse, AsyncOperationStatus } from "../../../../shared/typescript/types/api";
import { Given, When } from "../../../../shared/typescript/utilities/testing";
import { wasUserDeletedFromCognitoUserPool } from "../utilities/was-user-deleted-from-cognito-user-pool";

describe("Delete User", () => {

	it("Deletes a users account", async () => {

		const user = await Given.user.authenticated();

		const deleteResult = await When.user.delete() as unknown as AsyncOperationResponse; // delete user via the 'deleteUser' mutation;
		console.log("Delete Result:", deleteResult);
		expect(deleteResult.status).toBe(AsyncOperationStatus.Pending);

		const wasDeleted = await wasUserDeletedFromCognitoUserPool(user.id);
		expect(wasDeleted).toBe(true);

	});

});