
import { AWS } from "../../types/aws";
import { commomEnviromentResources, commonCloudFormationImports, commonCustom, commonEnviromentVariables, commonPluginConfig, commonPlugins } from "../../utilities/commons";
import { config, stacks } from "../../utilities/constants";
import { createDataSource, createMappingTemplate, generateServiceName, importLocalCloudFormationParam } from "../../utilities/functions";

const serverlessConfiguration: AWS.Service = {

  service: generateServiceName("user"),

  provider: {
    name: config.provider,
    region: config.region,
    stage: config.stage,
    runtime: config.runtime,
    environment: {
      ...commonEnviromentVariables,
      ...commomEnviromentResources,
      COGNITO_USER_POOL_ID: importLocalCloudFormationParam({
        stack: "authentication",
        output: stacks.auth.outputs.cognito.id
      }),
      COGNITO_CLIENT_ID: importLocalCloudFormationParam({
        stack: "authentication",
        output: stacks.auth.outputs.clients.web.id
      })
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
        }),
        createMappingTemplate({
          field: "editUser",
          type: "Mutation",
          source: "editUser",
        }),
        createMappingTemplate({
          field: "deleteUser",
          type: "Mutation",
          source: "deleteUser",
        })
      ],
      dataSources: [
        createDataSource("getProfile"),
        createDataSource("editUser"),
        createDataSource("deleteUser")
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

    editUser: {
      handler: "functions/edit-user.handler",
      iamRoleStatements: [
        {
          Effect: "Allow",
          Action: ["dynamodb:UpdateItem", "dynamodb:GetItem"],
          Resource: [
            "${self:custom.tableArn}"
          ]
        }
      ]
    },

    deleteUser: {
      handler: "functions/delete-user.handler",
      iamRoleStatements: [
        {
          Effect: "Allow",
          Action: ["dynamodb:DeleteItem"],
          Resource: [
            "${self:custom.tableArn}"
          ]
        }
      ]
    }

  }

} 


module.exports = serverlessConfiguration;