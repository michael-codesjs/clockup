import { Inputs } from "../../../../shared/typescript/io/types/user";
import type { AWS } from "../../../../shared/typescript/types/aws";
import { resource } from "../../../../shared/typescript/utilities";
import { handlerPath } from "../../../../shared/typescript/utilities/functions";

export const continueUser: AWS.ServerlessLambdaFunction = {

	description: "Continues a discontinued user.",
	handler: `${handlerPath(__dirname)}/handler.main`,

	events: [
		{
			eventBridge: {
				eventBus: resource.eventBusArn,
				pattern: {
					"detail-type": [Inputs.CONTINUE]
				}
			}
		},
		{
			http: {
				path: "/continue",
				method: "POST",
				cors: true,
				authorizer: "AWS_IAM",
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