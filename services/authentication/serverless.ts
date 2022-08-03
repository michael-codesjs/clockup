import type { AWS } from "../../types/aws";
import { config, stackOutputNames } from "../../utilities/constants";
import { commonCloudFormationImports, commonCustom, commonEnviromentVariables, commonPlugins } from "../../utilities/commons";
import { cognitoUserPoolResource, webCognitoClientResource } from "../../resources";
import { generateLogicalResourcelName, generateServiceName, importCloudFormationParam } from "../../utilities/functions";

const serverlessConfiguration: AWS.Extended = {

  service: generateServiceName("authentication"),

  provider: {
    name: config.provider,
    region: config.region,
    stage: config.stage,
    runtime: config.runtime,
    environment: {
      ...commonEnviromentVariables,
      DYNAMO_DB_TABLE_NAME: importCloudFormationParam({
        name: config.serviceName,
        stack: "root",
        stage: "${self:custom.stage}",
        output: stackOutputNames.dynamoDbTableName
      }),
    }
  },

  plugins: [
    ...commonPlugins,
  ],

  custom: {
    ...commonCustom,
    userPoolName: generateLogicalResourcelName("userPool"),
    tableArn: commonCloudFormationImports.tableArn,
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
        Value: { Ref: "WebCognitoUserPoolClient" },
        Export: { Name: stackOutputNames.cognitoClientId }
      }

    }
  },

  functions: {

    confirmSignUp: {
      handler: "functions/confirm-user-sign-up.handler",
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['dynamodb:PutItem', 'dynamodb:GetItem'],
          Resource: [
            "${self:custom.tableArn}"
          ]
        }
      ],
      events: [
        {
          cognitoUserPool: {
            pool: generateLogicalResourcelName("userPool"),
            existing: true,
            forceDeploy: true,
            trigger: "PostConfirmation"
          }
        }
      ],
    },

    preSignUp: {
      handler: "functions/pre-sign-up.handler",
       events: [
        {
          cognitoUserPool: {
            pool: generateLogicalResourcelName("userPool"),
            existing: true,
            forceDeploy: true,
            trigger: "PreSignUp"
          }
        }
      ],
    }

  }

}

module.exports = serverlessConfiguration;