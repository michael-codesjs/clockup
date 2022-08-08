
import { AWS } from "./types/aws";
import { commomEnviromentResources, commonCloudFormationImports, commonCustom, commonEnviromentVariables, commonPluginConfig, commonPlugins } from "./utilities/commons";
import { config, stackOutputNames } from "./utilities/constants";
import { generateServiceName, importCloudFormationParam, importLocalCloudFormationParam } from "./utilities/functions";


// DEPLOY THIS SERVICE LAST

const serverlessConfiguration: AWS.Extended = {

  service: generateServiceName("testing"),

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
        output: stackOutputNames.auth.cogntio.id
      }),
      COGNITO_CLIENT_ID: importLocalCloudFormationParam({
        stack: "authentication",
        output: stackOutputNames.auth.clients.web.id
      }),
    }
  },

  package: {
    individually: true
  },

  plugins: [
    ...commonPlugins
  ],
  custom: {
    ...commonCustom,
    ...commonPluginConfig,
    ...commonCloudFormationImports
  }
}

module.exports = serverlessConfiguration;