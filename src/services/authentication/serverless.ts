import type { AWS } from "../../types/aws";
import { esBuildConfig } from "../../plugin-configs/esbuild";
import { webCognitoClientResource } from "./resources/cognito-clients";
import { cognitoUserPoolResource } from "./resources/cognito-user-pool";
import { commonPlugins, config, stackOutputNames } from "../../utilities/constants";
import { generateLogicalResourcelName, generateServiceName, importCloudFormationParam } from "../../utilities/functions";

const serverlessConfiguration: AWS.Extended = {

  service: generateServiceName("authentication"),

  provider: {
    name: config.provider,
    region: config.region,
    stage: config.stage,
    runtime: config.runtime,
    environment: {
      REGION: "${self:custom.region}",
      COGNITO_USER_POOL_ID: { Ref: "CognitoUserPool" },
      COGNITO_CLIENT_ID: { Ref: "WebCognitoUserPoolClient" },
      DYNAMO_DB_TABLE_NAME: importCloudFormationParam({
        name: config.serviceName,
        stack: "root",
        stage: "${self:custom.stage}",
        output: stackOutputNames.dynamoDbTableName
      }),
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    }
  },

  plugins: [
    ...commonPlugins,
    "serverless-export-env",
    "serverless-iam-roles-per-function"
  ],

  custom: {
    region: "${opt:region, self:provider.region}",
    stage: "${opt:stage, self:provider.stage}",
    userPoolName: generateLogicalResourcelName("userPool"),
    ...esBuildConfig
  },

  resources: {

    Resources: {
      CognitoUserPool: cognitoUserPoolResource,
      WebCognitoUserPoolClient: webCognitoClientResource
    },

    Outputs: {
      
      [stackOutputNames.cognitoUserPoolId]: {
        Value: { Ref: "CognitoUserPool" },
        Export: { Name: stackOutputNames.cognitoUserPoolId }
      },

      [stackOutputNames.cognitoClientId]: {
        Value: "WebCognitoUserPoolClient",
        Export: { Name: stackOutputNames.cognitoClientId }
      }
    }

  },

  functions: {

    confirmUserSign: {
      handler: "functions/confirm-user-sign-up.handler",
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['dynamodb:PutItem', 'dynamodb:GetItem'],
          Resource: [
            importCloudFormationParam({
              name: config.serviceName,
              stack: "root",
              stage: "${self:custom.stage}",
              output: stackOutputNames.dynamoDbTableArn
            })
          ]
        }
      ],
      events: [
        {
          cognitoUserPool: {
            pool: "${self:custom.userPoolName}",
            existing: true,
            forceDeploy: true,
            trigger: "PostConfirmation"
          }
        }
      ],
    }

  }

}

module.exports = serverlessConfiguration;