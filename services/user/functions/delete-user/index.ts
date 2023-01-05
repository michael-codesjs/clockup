import type { AWS } from "../../../../shared/typescript/types/aws";
import { cloudImports } from "../../../../shared/typescript/utilities/cloud-imports";
import { handlerPath } from "../../../../shared/typescript/utilities/functions";
import { Inputs } from "../../../../shared/typescript/io/types/user";

export const deleteUser: AWS.ServerlessLambdaFunction = {

	description: "Discontinues a user.",
	handler: `${handlerPath(__dirname)}/handler.main`,

	events: [
		{
			sns: {
				arn: cloudImports.userTopicArn,
				enabled: true,
				filterPolicy: {
					type: [Inputs.CREATE]
				}
			}
		}
	],

	iamRoleStatements: [
		{
			Effect: "Allow",
			Action: ["dynamodb:UpdateItem"],
			Resource: cloudImports.tableArn
		}
	]

};