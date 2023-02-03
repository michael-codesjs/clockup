import { CognitoIdentityServiceProvider } from "aws-sdk";
import { withCommonInput, withOutputResponse } from "../../../../shared/typescript/hofs";
import { withLambdaIOStandard } from "../../../../shared/typescript/hofs/with-lambda-io-standard";
import { Inputs, UPDATE, UPDATED } from "../../../../shared/typescript/io/types/authentication";
import { cognitoProvider } from "../../../../shared/typescript/lib/cognito";
import { CommonIOHandler } from "../../../../shared/typescript/middleware/common-lambda-io/types";
import { configureEnviromentVariables } from "../../../../shared/typescript/utilities/functions";

const { COGNITO_USER_POOL_ID } = configureEnviromentVariables();

/** handler for the 'updateCognitoUser' lambda function. */
const handler: CommonIOHandler<UPDATE, UPDATED> = withCommonInput(async input => {

	const updateCognitoUser = async (): Promise<string> => {

		const { id, ...rest } = input.payload;

		const UserAttributes: CognitoIdentityServiceProvider.AttributeListType = Object.entries(rest).map(([key, value]) => ({
			Name: key,
			Value: value
		}));

		const adminUpdateUserArgs: CognitoIdentityServiceProvider.AdminUpdateUserAttributesRequest = {
			UserPoolId: COGNITO_USER_POOL_ID,
			Username: id,
			UserAttributes
		};

		await cognitoProvider()
			.adminUpdateUserAttributes(adminUpdateUserArgs)
			.promise();

		return `Cognito user ${id} updated successfully`;

	}

	const responsePayload = await withOutputResponse(updateCognitoUser);

	console.log("Response:", responsePayload);

	return {
		type: Inputs.UPDATED,
		payload: responsePayload
	};

});

/** 'updateCognitoUser' lambda function handler wrapped in it's required middleware. */
export const main = withLambdaIOStandard(handler);