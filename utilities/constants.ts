import { Chance } from "chance";

export const chance = new Chance();

export enum config {
  serviceName = "clock-up",
  provider = "aws",
  region = "eu-central-1",
  stage = "dev",
  runtime = "nodejs16.x",
}

export type stacks = "root" | "authentication" | "api" | "user" | "alarm";

export const logicalResourceNames = Object.freeze({
	table: "DynamoDbTable",
	assetsBucket: "AssetsBucket",
	userPool: "CognitoUserPool",
	userPoolWebClient: "WebCognitoUserPoolClient",
	// functions:
	ConfirmSignUpLambdaFunction: "ConfirmSignUpLambdaFunction",
	PreSignUpLambdaFunction: "PreSignUpLambdaFunction",
	// permissions:
	InvokeConfirmUserSignUpPermission: "InvokeConfirmUserSignUpPermission",
	InvokePreSignUpPermission: "InvokePreSignUpPermission"
});