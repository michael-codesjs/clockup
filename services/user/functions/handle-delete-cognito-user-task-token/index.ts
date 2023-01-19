import { Inputs } from "../../../../shared/typescript/io/types/authentication";
import type { AWS } from "../../../../shared/typescript/types/aws";
import { resource } from "../../../../shared/typescript/utilities";
import { handlerPath } from "../../../../shared/typescript/utilities/functions";

export const handleDeleteCognitoUserTaskToken: AWS.ServerlessLambdaFunction = {
	description: "Receives the delete cognito user task token.",
	handler: `${handlerPath(__dirname)}/handler.main`,
	events: [
		{
			sqs: {
				arn: resource.user.responseQueueArn,
				enabled: true,
				batchSize: 1,
				maximumBatchingWindow: 0,
				filterPatterns: [{
					messageAttributes: {
						Type: {
							stringValue: [Inputs.DELETE]
						}
					}
				}]
			}
		}
	],

	iamRoleStatements: [
		{
			Effect: "Allow",
			Resource: "${self:resources.Outputs.DeleteUserStateMachineArn.Value}",
			Action: ["states:SendTaskSuccess", "states:SendTaskFailure"]
		}
	]

};