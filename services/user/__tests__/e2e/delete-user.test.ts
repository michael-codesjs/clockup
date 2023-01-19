import { AsyncOperationResponse, AsyncOperationStatus } from "../../../../shared/typescript/types/api"
import { Given, Repeat, When } from "../../../../shared/typescript/utilities/testing";
import { cognitoProvider } from "../../../../shared/typescript/lib/cognito";
import { configureEnviromentVariables } from "../../../../shared/typescript/utilities/functions";

const { COGNITO_USER_POOL_ID } = configureEnviromentVariables();

describe("Delete User", () => {

	it("Deletes a users account", async () => {

		const user = await Given.user.authenticated();

		const deleteResult = await When.user.delete() as unknown as AsyncOperationResponse; // delete user e2e;

		expect(deleteResult.status).toBe(AsyncOperationStatus.Pending);

		const wasDeleted = await Repeat.timedOnCondition({
			times: 10,
			duration: 200,
			call: async () => {
				const postDeleteDbRecord = await Given.user.byId(user.id);
				expect(postDeleteDbRecord.discontinued).toBe(true);
				try {
					await cognitoProvider()
						.adminGetUser({
							Username: user.id,
							UserPoolId: COGNITO_USER_POOL_ID
						})
						.promise();
					throw new Error("User was not deleted from cognito.");
				} catch (error: any) {
					expect(error.code).toBe("UserNotFoundException");
				}
				return true;
			}
		});

		expect(wasDeleted).toBe(true);

	});

});