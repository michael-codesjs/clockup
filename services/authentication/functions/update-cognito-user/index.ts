import { Inputs } from "../../../../shared/typescript/io/types/authentication";
import type { AWS } from "../../../../shared/typescript/types/aws";
import { resource } from "../../../../shared/typescript/utilities";
import { handlerPath } from "../../../../shared/typescript/utilities/functions";

/** 'updateCognitoUser' lambda function sls definition. */
export const updateCognitoUser: AWS.ServerlessLambdaFunction = {
	
	description: "Updates a cognito users details.",
	handler: handlerPath(__dirname) + "/handler.main",
	
	events: [{
		eventBridge: {
			eventBus: resource.eventBusArn,
			pattern: {
				"detail-type": [Inputs.UPDATE]
			}
		}
	}],

	iamRoleStatements: [
		{
			Effect: "Allow",
			Resource: resource.authentication.userPoolArn,
			Action: ["cognito-idp:AdminUpdateUserAttributes"]
		},
		{
			Effect: "Allow",
			Resource: resource.eventBusArn,
			Action: ["events:putEvents"]
		}
	]
	
};