
import { AWS } from "../../types/aws";
import { commonCustom, commonEnviromentVariables, commonPluginConfig, commonPlugins } from "../../utilities/commons";
import { config, stacks } from "../../utilities/constants";
import { generateServiceName, importLocalCloudFormationParam } from "../../utilities/functions";

const serverlessConfiguration: AWS.Service = {

  service: generateServiceName("api"),

  provider: {
    name: config.provider,
    region: config.region,
    stage: config.stage,
    runtime: config.runtime,
    environment: {
      REGION: commonEnviromentVariables.REGION,
      STAGE: commonEnviromentVariables.STAGE,
    }
  },

  package: {
    individually: true
  },

  plugins: [
    ...commonPlugins,
    "serverless-appsync-plugin"
  ],

  custom: {
    ...commonCustom,
    ...commonPluginConfig,
    appSync: {
      name: generateServiceName("api"),
      schema: "../../schema.graphql",
      region: "${self:custom.region}",
      authenticationType: "AMAZON_COGNITO_USER_POOLS",
      userPoolConfig: {
        userPoolId: importLocalCloudFormationParam({
          stack: "authentication",
          output: stacks.auth.outputs.cognito.id
        }),
        defaultAction: "ALLOW",
      },
      additionalAuthenticationProviders: [
        { authenticationType: 'AWS_IAM' }
      ],
      mappingTemplatesLocation: "../../mapping-templates",
      dataSources: [
        {
          type: "NONE",
          name: "none",
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;