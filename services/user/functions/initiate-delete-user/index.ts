import type { AWS } from "../../../../shared/typescript/types/aws";
import { resource } from "../../../../shared/typescript/utilities";
import { handlerPath } from "../../../../shared/typescript/utilities/functions";

export const initiateDeleteUser: AWS.ServerlessLambdaFunction = {
	description: "Starts the DeleteUser state machine.",
	handler: `${handlerPath(__dirname)}/handler.main`,
	iamRoleStatements: [
		{
			Effect: "Allow",
			Action: ["states:StartExecution"],
			Resource: ["${self:resources.Outputs.DeleteUserStateMachineARN.Value}"]
		}
	]
};