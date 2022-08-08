
export enum config {
  serviceName = "clock-up",
  provider = "aws",
  region = "eu-central-1",
  stage = "development",
  runtime = "nodejs16.x",
};

export type stacks = "root" | "authentication" | "api" | "user" | "alarm";

export const logicalResourceNames = {
  table: "DynamoDbTable",
  userPool: "CognitoUserPool",
  userPoolWebClient: "WebCognitoUserPoolClient"
}

export const stackOutputNames = {

  root: {

    table: {
      stack: "root",
      name: "dynamoDbTableName",
      arn: "dynamoDbTableArn",
    }

  },

  auth: {

    cogntio: {
      id: "cognitoUserPoolId",
      arn: "cognitoUserPoolArn",
    },

    clients: {
      web: {
        id:  "cognitoClientId"
      }
    }

  },

  api: {
    id:  "GraphQlApiId",
    endpoint: "GraphQlApiUrl"
  }

}

