import { withOutputResponse, withCommonInput } from "../../../../shared/typescript/hofs";
import { withLambdaIOStandard } from "../../../../shared/typescript/hofs/with-lambda-io-standard";
import { DELETE, DELETED, Inputs } from "../../../../shared/typescript/io/types/authentication";
import { cognitoProvider } from "../../../../shared/typescript/lib/cognito";
import { CommonIOHandler } from "../../../../shared/typescript/middleware/common-lambda-io/types";
import { OperationResponse } from "../../../../shared/typescript/types/api";
import { configureEnviromentVariables } from "../../../../shared/typescript/utilities/functions";

const { COGNITO_USER_POOL_ID } = configureEnviromentVariables();

/** handler for the 'deleteCognitoUser' lambda function in the authentication service. */
const handler: CommonIOHandler<DELETE, DELETED> = withCommonInput(async input => {

	const deleteUser = async () => {

		await cognitoProvider()
			.adminDeleteUser({ UserPoolId: COGNITO_USER_POOL_ID, Username: input.payload.id })
			.promise();

		return `Cognito user ${input.payload.id} has been deleted successfully.`;

	}

	const responsePayload = await withOutputResponse(deleteUser);

	return {
		type: Inputs.DELETED,
		payload: responsePayload,
	};

});

/** 'deleteCognitoUser' lambda function handler wrapped in it's required middleware. */
export const main = withLambdaIOStandard(handler);