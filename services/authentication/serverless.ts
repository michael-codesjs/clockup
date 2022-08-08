import type { AWS } from "../../types/aws";
import { config, stackOutputNames } from "../../utilities/constants";
import { commonCloudFormationImports, commonCustom, commonEnviromentVariables, commonPlugins } from "../../utilities/commons";
import { cognitoUserPoolResource, webCognitoClientResource } from "../../resources";
import { generateLogicalResourcelName, generateServiceName, importLocalCloudFormationParam } from "../../utilities/functions";

const serverlessConfiguration: AWS.Extended = {

  service: generateServiceName("authentication"),


  provider: {

    name: config.provider,
    region: config.region,
    stage: config.stage,
    runtime: config.runtime,

    environment: {
      ...commonEnviromentVariables,
      DYNAMO_DB_TABLE_NAME: importLocalCloudFormationParam({
        stack: "root",
        output: stackOutputNames.root.table.name
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
      ...cognitoUserPoolResource,
      ...webCognitoClientResource
    },

    Outputs: {

      [stackOutputNames.auth.cogntio.id]: {
        Value: { Ref: "CognitoUserPool" },
        Export: { Name: stackOutputNames.auth.cogntio.id }
      },

      [stackOutputNames.auth.clients.web.id]: {
        Value: { Ref: "WebCognitoUserPoolClient" },
        Export: { Name: stackOutputNames.auth.clients.web.id }
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
            pool: "${self:custom.userPoolName}",
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