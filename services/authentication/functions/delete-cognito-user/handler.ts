import { withCommonInput } from "../../../../shared/typescript/hofs";
import { withLambdaIOStandard } from "../../../../shared/typescript/hofs/with-lambda-io-standard";
import { Delete } from "../../../../shared/typescript/io/types/authentication";
import { cognitoProvider } from "../../../../shared/typescript/lib/cognito";
import { CommonIOHandler } from "../../../../shared/typescript/middleware/common-lambda-io/types";
import { OperationResponse } from "../../../../shared/typescript/types/api";
import { configureEnviromentVariables } from "../../../../shared/typescript/utilities/functions";

const { COGNITO_USER_POOL_ID } = configureEnviromentVariables();

/** handler for the 'deleteCognitoUser' lambda function. */
const handler: CommonIOHandler<Delete, OperationResponse> = withCommonInput(async input => {

	const response: OperationResponse = {
		__typename: "OperationResponse",
		success: true,
		message: JSON.stringify(input)
	}

	try {

		await cognitoProvider()
			.adminDeleteUser({ UserPoolId: COGNITO_USER_POOL_ID, Username: input.id })
			.promise();

	} catch (error: any) {
		response.success = false;
	}

	return response;

});

/** 'createUser' lambda function handler wrapped in it's required middleware. */
export const main = withLambdaIOStandard(handler);