import { Inputs } from "../../../../shared/typescript/io/types/user";
import type { AWS } from "../../../../shared/typescript/types/aws";
import { resource } from "../../../../shared/typescript/utilities";
import { handlerPath } from "../../../../shared/typescript/utilities/functions";

/** 'handleUserCreatablesCleanUpResponse' lambda function sls definition. */
export const handleCreatablesCleanUpResponse: AWS.ServerlessLambdaFunction = {

	description: "Handles the user creatables clean up resposne.",
	handler: `${handlerPath(__dirname)}/handler.main`,
	
	events: [
		{
			eventBridge: {
				eventBus: resource.eventBusArn,
				pattern: {
					"detail-type": [Inputs.CREATABLES_CLEANED_UP]
				}
			}
		}
	],

	iamRoleStatements: [
		{
			Effect: "Allow",
			Action: ["events:PutEvents"],
			Resource: resource.eventBusArn
		}
	]

};