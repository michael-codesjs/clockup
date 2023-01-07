import type { AWS } from "../../../../shared/typescript/types/aws";
import { resource } from "../../../../shared/typescript/utilities";
import { handlerPath } from "../../../../shared/typescript/utilities/functions";
import { Inputs } from "../../../../shared/typescript/io/types/user";

export const deleteUser: AWS.ServerlessLambdaFunction = {

	description: "Deletes(discontinues) a user.",
	handler: `${handlerPath(__dirname)}/handler.main`,

	events: [
		{
			sns: {
				arn: resource.user.topicArn,
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
			Resource: resource.user.tableArn
		}
	]

};