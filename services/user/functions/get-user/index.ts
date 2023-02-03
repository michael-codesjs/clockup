import type { AWS } from "../../../../shared/typescript/types/aws";
import { handlerPath } from "../../../../shared/typescript/utilities/functions";
import { resource } from "../../../../shared/typescript/utilities/resource";

export const getUser: AWS.ServerlessLambdaFunction = {

	description: "Gets a user.",
	handler: handlerPath(__dirname) + "/handler.main",

	events: [
		{
			http: {
				method: "GET",
				path: "/",
				cors: true,
				authorizer: "AWS_IAM",
			}
		}
	],

	iamRoleStatements: [
		{
			Effect: "Allow",
			Action: ["dynamodb:GetItem"],
			Resource: [
				resource.user.tableArn,
				resource.user.tableArn + "/*"
			]
		}
	]

};