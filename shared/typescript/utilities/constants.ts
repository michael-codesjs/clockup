import { Chance } from "chance";

export const chance = new Chance();

export enum config {
  serviceName = "clockup",
  provider = "aws",
  region = "eu-central-1",
  stage = "dev",
  runtime = "nodejs16.x",
}

export type stacks = "infrastructure" | "authentication" | "api" | "user" | "alarm";

export const logicalResourceNames = Object.freeze({
	table: "DynamoDbTable",
	assetsBucket: "AssetsBucket",
	userPool: "CognitoUserPool",
	userPoolWebClient: "WebCognitoUserPoolClient",
	// functions:
	ConfirmSignUpLambdaFunction: "ConfirmSignUpLambdaFunction",
	PreSignUpLambdaFunction: "PreSignUpLambdaFunction",
	SyncOnUpdateLambdaFunction: "SyncOnUpdateLambdaFunction", 
	// permissions:
	InvokeConfirmUserSignUpPermission: "InvokeConfirmUserSignUpPermission",
	InvokePreSignUpPermission: "InvokePreSignUpPermission",
	InvokeSyncOnUpdatePermission: "InvokeSyncOnUpdatePermission"
});