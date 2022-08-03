
import { AWS } from "./types/aws";
import { commomEnviromentResources, commonCloudFormationImports, commonCustom, commonEnviromentVariables, commonPluginConfig, commonPlugins } from "./utilities/commons";
import { config, stackOutputNames } from "./utilities/constants";
import { generateServiceName, importCloudFormationParam } from "./utilities/functions";


// DEPLOY THIS SERVICE LAST

const serverlessConfiguration: AWS.Extended = {

  service: generateServiceName("test"),

  provider: {
    name: config.provider,
    region: config.region,
    stage: config.stage,
    runtime: config.runtime,
    environment: {
      ...commonEnviromentVariables,
      ...commomEnviromentResources,
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