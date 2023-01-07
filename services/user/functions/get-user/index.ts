import type { AWS } from "../../../../shared/typescript/types/aws";
import { Inputs } from "../../../../shared/typescript/io/types/user";
import { cloudImports } from "../../../../shared/typescript/utilities/resource";
import { handlerPath } from "../../../../shared/typescript/utilities/functions";

export const createUser: AWS.ServerlessLambdaFunction = {

	description: "Creates a user.",
	handler: `${handlerPath(__dirname)}/handler.main`,

	events: [
		{
			sqs: {
				arn: cloudImports.userCreateQueueArn,
				enabled: true,
				batchSize: 1,
				maximumBatchingWindow: 0
			}
		}
	],

	iamRoleStatements: [
		{
			Effect: "Allow",
			Action: ["dynamodb:PutItem"],
			Resource: cloudImports.tableArn
		}
	]

};