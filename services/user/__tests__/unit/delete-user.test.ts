import { cognitoProvider } from "../../../../shared/typescript/lib/cognito";
import { EntityType, User } from "../../../../shared/typescript/types/api";
import { chance } from "../../../../shared/typescript/utilities/constants";
import { configureEnviromentVariables, delay } from "../../../../shared/typescript/utilities/functions";
import { Given } from "../../../../shared/typescript/utilities/testing";
import { executeDeleteUser } from "../utilities/execute-delete-user";
import { wasUserDeletedFromCognitoUserPool } from "../utilities/was-user-deleted";

const { COGNITO_USER_POOL_ID } = configureEnviromentVariables();

describe("DeleteUser State Machine", () => {

	let user: User;
	let CID: string;
	let payload: {
		id: string,
		creator: string,
		creatorType: EntityType
	}

	beforeEach(async () => {
		user = await Given.user.authenticated();
		CID = chance.guid({ version: 5 });
		payload = {
			id: user.id,
			creator: user.creator,
			creatorType: user.entityType
		}
	});

	const deleteUserFromCognito = async () => (
		await cognitoProvider()
			.adminDeleteUser({
				UserPoolId: COGNITO_USER_POOL_ID,
				Username: user.id
			})
			.promise()
	);

	test("Successful DeleteUser state machine run.", async () => {
		await executeDeleteUser({ CID, payload });
		const wasDeleted = await wasUserDeletedFromCognitoUserPool(user.id, { times: 10, duration: 300 });
		expect(wasDeleted).toBe(true);
	});

	test("Creator Checks", async () => {
		await executeDeleteUser({ CID, payload: { ...payload, creator: chance.guid({ version: 5 }) } });
		const wasDeleted = await wasUserDeletedFromCognitoUserPool(user.id, { times: 10, duration: 500 });
		expect(wasDeleted).toBe(false);
	});

	test("User continuity rollback", async () => {

		// deleting the user from cognito will make the DeleteCognitoUser step to fail.
		// causing the state machine to rollback a users continuity.

		await deleteUserFromCognito();
		await executeDeleteUser({ CID, payload });
		await delay(4000); // ussually takes < 3s

		const wasDeleted = await wasUserDeletedFromCognitoUserPool(user.id, { times: 1, duration: 0 });
		expect(wasDeleted).toBe(true);

		user = await Given.user.byId(user.id);
		expect(user.discontinued).toBe(false);

	});

});