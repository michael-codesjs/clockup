import type { AWS } from "../../../../shared/typescript/types/aws";
import { resource } from "../../../../shared/typescript/utilities";
import { handlerPath } from "../../../../shared/typescript/utilities/functions";

export const discontinueUser: AWS.ServerlessLambdaFunction = {
	description: "Discontinues a user.",
	handler: `${handlerPath(__dirname)}/handler.main`,
	iamRoleStatements: [
		{
			Effect: "Allow",
			Action: ["dynamodb:UpdateItem"],
			Resource: resource.user.tableArn
		}
	]
};