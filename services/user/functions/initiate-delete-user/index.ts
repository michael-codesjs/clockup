import { Inputs } from "../../../../shared/typescript/io/types/user";
import type { AWS } from "../../../../shared/typescript/types/aws";
import { resource } from "../../../../shared/typescript/utilities";
import { handlerPath } from "../../../../shared/typescript/utilities/functions";

/** 'initiateDeleteUser' lambda function sls definition. */
export const initiateDeleteUser: AWS.ServerlessLambdaFunction = {

	description: "Initiates the delete user process.",
	handler: `${handlerPath(__dirname)}/handler.main`,
	
	events: [
		{
			eventBridge: {
				eventBus: resource.eventBusArn,
				pattern: {
					"detail-type": [Inputs.INITIATE_DELETE]
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