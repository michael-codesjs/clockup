import { Inputs } from "../../../../shared/typescript/io/types/authentication";
import type { AWS } from "../../../../shared/typescript/types/aws";
import { resource } from "../../../../shared/typescript/utilities";
import { handlerPath } from "../../../../shared/typescript/utilities/functions";

/** 'deleteCognitoUser' lambda function sls definition */
export const deleteCognitoUser: AWS.ServerlessLambdaFunction = {

	description: "Deletes a user from the cognito user pool.",
	handler: handlerPath(__dirname) + "/handler.main",

	events: [{
		eventBridge: {
			eventBus: resource.eventBusArn,
			pattern: {
				"detail-type": [Inputs.DELETE]
			}
		}
	}],

	iamRoleStatements: [
		{
			Effect: "Allow",
			Resource: resource.authentication.userPoolArn,
			Action: ["cognito-idp:AdminDeleteUser"]
		},
		{
			Effect: "Allow",
			Resource: resource.eventBusArn,
			Action: ["events:putEvents"]
		}
	]

};