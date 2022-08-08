
import { AWS } from "../../types/aws";
import { commomEnviromentResources, commonCloudFormationImports, commonCustom, commonEnviromentVariables, commonPluginConfig, commonPlugins } from "../../utilities/commons";
import { config } from "../../utilities/constants";
import { createDataSource, createMappingTemplate, generateServiceName } from "../../utilities/functions";

const serverlessConfiguration: AWS.Extended = {

  service: generateServiceName("user"),

  provider: {
    name: config.provider,
    region: config.region,
    stage: config.stage,
    runtime: config.runtime,
    environment: {
      ...commonEnviromentVariables,
      ...commomEnviromentResources
    }
  },

  plugins: [
    ...commonPlugins,
    "serverless-appsync-plugin",
  ],

  custom: {
    ...commonCustom,
    ...commonPluginConfig,
    ...commonCloudFormationImports,
    appSync: {
      apiId: "${self:custom.apiId}",
      schema: "../../schema.graphql",
      mappingTemplates: [
        createMappingTemplate({
          field: "getProfile",
          type: "Query",
          source: "getProfile",
        })
      ],
      dataSources: [
        createDataSource("getProfile")
      ]
    },

  },

  functions: {

    getProfile: {
      handler: "functions/get-profile.handler",
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['dynamodb:GetItem'],
          Resource: [
            "${self:custom.tableArn}"
          ]
        }
      ]
    },

    editProfile: {
      handler: "functions/edit-profile.handler",
      iamRoleStatements: [
        {
          Effect: "Allow",
          Action: ["dynamodb:UpdateItem"],
          Resource: [
            "${self:custom.tableArn}"
          ]
        }
      ]
    }

  }

} 


module.exports = serverlessConfiguration;