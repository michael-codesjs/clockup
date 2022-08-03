
export enum config {
  serviceName = "clock-up",
  provider = "aws",
  region = "eu-central-1",
  stage = "development",
  runtime = "nodejs16.x",
};

export const stackOutputNames = {

  /* STORAGE */

  dynamoDbTableName: "dynamoDbTableName",
  dynamoDbTableArn: "dynamoDbTableArn",

  /* AUTH */

  // cognitoUserPoolName: "cognitoUserPoolName",
  cognitoUserPoolId: "cognitoUserPoolId",
  cognitoUserPoolArn: "cognitoUserPoolArn",

  cognitoClientId: "cognitoClientId",

  /* API */

  GraphQlApiId: "GraphQlApiId",
  GraphQlApiUrl: "GraphQlApiUrl",

}

