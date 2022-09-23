import { cognitoProvider } from "@lib/cognito";
import { configureEnviromentVariables } from "@utilities/functions";
import { DynamoDBStreamHandler } from "aws-lambda";

const { COGNITO_USER_POOL_ID } = configureEnviromentVariables();

export const handler: DynamoDBStreamHandler = async event => {

	for (const record of event.Records) {
		const id = record.dynamodb.OldImage.id.S;
		await cognitoProvider()
			.adminDeleteUser({
				Username: id,
				UserPoolId: COGNITO_USER_POOL_ID!
			})
			.promise();
	}

};