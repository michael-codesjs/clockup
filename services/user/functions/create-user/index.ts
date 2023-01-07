import { Inputs } from "../../../../shared/typescript/io/types/user";
import type { AWS } from "../../../../shared/typescript/types/aws";
import { resource } from "../../../../shared/typescript/utilities";
import { handlerPath } from "../../../../shared/typescript/utilities/functions";

export const createUser: AWS.ServerlessLambdaFunction = {

	description: "Creates a user and sends the response to the user response queue.",
	handler: `${handlerPath(__dirname)}/handler.main`,

	events: [
		{
			sqs: {
				arn: resource.user.requestQueueArn,
				enabled: true,
				batchSize: 1,
				maximumBatchingWindow: 0,
				filterPatterns: [{
					messageAttributes: {
						Type: {
							stringValue: [Inputs.CREATE]
						}
					}
				}]
			}
		}
	],

	iamRoleStatements: [
		{
			Effect: "Allow",
			Action: ["dynamodb:PutItem"],
			Resource: resource.user.tableArn
		}
	]

};