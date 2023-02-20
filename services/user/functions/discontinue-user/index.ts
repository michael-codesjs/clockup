import { Inputs } from "../../../../shared/typescript/io/types/user";
import type { AWS } from "../../../../shared/typescript/types/aws";
import { resource } from "../../../../shared/typescript/utilities";
import { handlerPath } from "../../../../shared/typescript/utilities/functions";

/** 'discontinueUser' lambda function sls definition. */
export const discontinueUser: AWS.ServerlessLambdaFunction = {

	description: "Discontinues a user.",
	handler: `${handlerPath(__dirname)}/handler.main`,
	
	events: [
		{
			eventBridge: {
				eventBus: resource.eventBusArn,
				pattern: {
					"detail-type": [Inputs.DISCONTINUE]
				}
			}
		}
	],

	iamRoleStatements: [
		{
			Effect: "Allow",
			Action: ["dynamodb:UpdateItem"],
			Resource: resource.user.tableArn
		},
		{
			Effect: "Allow",
			Action: ["events:PutEvents"],
			Resource: resource.eventBusArn
		}
	]

};