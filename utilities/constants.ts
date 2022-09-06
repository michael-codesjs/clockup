
export enum config {
  serviceName = "clock-up",
  provider = "aws",
  region = "eu-central-1",
  stage = "dev",
  runtime = "nodejs16.x",
};

export type stacks = "root" | "authentication" | "api" | "user" | "alarm";

export const logicalResourceNames = {
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

}

export const stacks = {

  root: {
    name: "root",
    outputs: {
      table: {
        stack: "root",
        name: "dynamoDbTableName",
        arn: "dynamoDbTableArn",
      },
      assetsBucket: {
        stack: "root",
        name: "assetsBucketName",
        arn: "assetsBucketArn",
      }
    }
  },

  auth: {
    name: "authentication",
    outputs: {
      cognito: {
        id: "cognitoUserPoolId",
        arn: "cognitoUserPoolArn",
      },

      clients: {
        web: {
          id: "cognitoClientId"
        }
      },
    }

  },

  api: {
    name: "api",
    outputs: {
      api: {
        id: "GraphQlApiId",
        endpoint: "GraphQlApiUrl"
      }
    }
  },

  user: {
    name: "user",
    outputs: {
      
    }
  }

}

