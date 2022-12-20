import type { AWS } from "../../../../shared/typescript/types/aws";
import { UserMessages } from "../../../../shared/typescript/types/topic-messages";
import { cloudImports } from "../../../../shared/typescript/utilities/cloud-imports";
import { handlerPath } from "../../../../shared/typescript/utilities/functions";

export const createUser: AWS.ServerlessLambdaFunction = {

	description: "Creates a user.",
	handler: `${handlerPath(__dirname)}/handler.main`,

	events: [
		{
			sns: {
				arn: cloudImports.userTopicArn,
				filterPolicy: {
					type: [UserMessages.CREATE]
				}
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