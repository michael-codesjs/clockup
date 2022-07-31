

export enum config {
  serviceName = "clock-up",
  provider = "aws",
  region = "eu-central-1",
  stage = "development",
  runtime = "nodejs16.x",
};

export const commonPlugins = [
  "serverless-esbuild",
  // "serverless-appsync-plugin",
  // "serverless-iam-roles-per-function",
];


export const serverlessResourceNames = {
  table: "DynamoDbTable"
}

export const stackOutputNames = {

  /* STORAGE */

  dynamoDbTableName: "dynamoDbTableName",
  dynamoDbTableArn: "dynamoDbTableArn",

  /* AUTH */

  cognitoUserPoolId: "cognitoUserPoolId",
  cognitoUserPoolArn: "cognitoUserPoolArn",

  cognitoClientId: "cognitoClientId",

}