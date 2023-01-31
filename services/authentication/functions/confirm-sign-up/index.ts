import type { AWS } from "../../../../shared/typescript/types/aws";
import { handlerPath } from "../../../../shared/typescript/utilities/functions";

export const confirmSignUp: AWS.ServerlessLambdaFunction = {
	description: "Receives a PostConfirmation event from cognito and sends a create user request to the user topic.",
	handler: handlerPath(__dirname) + "/handler.main",
	events: [
		{
			cognitoUserPool: {
				pool: "clockup-user-pool-${self:custom.stage}",
				existing: true,
				trigger: "PostConfirmation"
			}
		}
	],
	iamRoleStatements: [{
		Effect: "Allow",
		Resource: "*", // TODO: only allow execute API on API/${stage}/POST, resource: https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-iam-policy-examples-for-api-execution.html
		Action: ["execute-api:Invoke"]
	}]
};