import { Inputs } from "../../../../shared/typescript/io/types/authentication";
import type { AWS } from "../../../../shared/typescript/types/aws";
import { resource } from "../../../../shared/typescript/utilities";
import { handlerPath } from "../../../../shared/typescript/utilities/functions";

export const deleteCognitoUser: AWS.ServerlessLambdaFunction = {
	description: "Deletes a user from the cognito user pool.",
	handler: handlerPath(__dirname)+"/handler.main",
	events: [
		{
			sqs: {
				arn: resource.authentication.requestQueueArn,
				enabled: true,
				batchSize: 1,
				maximumBatchingWindow: 0,
				filterPatterns: [{
					messageAttributes: {
						Type: {
							stringValue: [Inputs.DELETE]
						}
					}
				}]
			}
		}
	],
	iamRoleStatements: [
		{
			Effect: "Allow",
			Resource: resource.authentication.userPoolArn,
			Action: ["cognito-idp:AdminDeleteUser"]
		},
		{
			Effect: "Allow",
			Resource: resource.user.responseQueueArn,
			Action: ["sqs:SendMessage"]
		}
	]
};