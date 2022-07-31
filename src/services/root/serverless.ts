
import type { AWS } from "@serverless/typescript"
import { commonPlugins, config, stackOutputNames } from "../../utilities/constants";
import { esBuildConfig } from "../../plugin-configs/esbuild";
import { dynamoDbResource } from "./resources/dynamodb";
import { generateServiceName } from "../../utilities/functions";


const serverlessConfiguration: AWS = {

  service: generateServiceName("root"),

  provider: {
    name: config.provider,
    region: config.region,
    stage: config.stage,
    runtime: config.runtime,
    environment: {
      REGION: "${self:custom.region}",
      STAGE: "${self:custom.stage}",
      TABLE_NAME: { Ref: "DynamoDbTable" },
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
    }
  },

  package: {
    exclude: [
      "package.json",
      "package-lock.json"
    ],
    individually: true
  },

  plugins: [
    ...commonPlugins
  ],

  custom: {
    stage: "${opt:stage, self:provider.stage}",
    region: "${opt:region, self:provider.region}",
    ...esBuildConfig,
  },

  resources: {

    Resources: {
      DynamoDbTable: dynamoDbResource
    },

    Outputs: {

      [stackOutputNames.dynamoDbTableName]: {
        Value: { Ref: "DynamoDbTable"},
        Export: { Name: stackOutputNames.dynamoDbTableName },
      },

      [stackOutputNames.dynamoDbTableArn]: {
        Value: { "Fn::GetAtt": ["DynamoDbTable", "Arn"] },
        Export: { Name: stackOutputNames.cognitoUserPoolArn }
      }

    }

  }
}

module.exports = serverlessConfiguration;
