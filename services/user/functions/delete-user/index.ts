import type { AWS } from "../../../../shared/typescript/types/aws";
import { cloudImports } from "../../../../shared/typescript/utilities/cloud-imports";
import { handlerPath } from "../../../../shared/typescript/utilities/functions";
import { Inputs } from "../../../../shared/typescript/io/types/user";

export const deleteUser: AWS.ServerlessLambdaFunction = {

	description: "Deletes(discontinues) a user.",
	handler: `${handlerPath(__dirname)}/handler.main`,

	events: [
		{
			sns: {
				arn: cloudImports.userTopicArn,
				filterPolicy: {
					type: [Inputs.DELETE]
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