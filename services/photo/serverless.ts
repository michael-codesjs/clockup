import { AWS } from "../../types/aws";
import { commonPluginConfig, commonEnviromentVariables, commomEnviromentResources, commonCloudFormationImports, commonCustom, commonPlugins, commonProviderAttributes } from "../../utilities/commons";


const serverlessConfiguration: AWS.Service = {

  service: "photo",

  provider: {
    ...commonProviderAttributes,
    environment: {
      ...commonEnviromentVariables,
      ...commomEnviromentResources
    }
  },

  plugins: [
    ...commonPlugins
  ],

  custom: {
    ...commonCustom,
    ...commonCloudFormationImports,
    ...commonPluginConfig
  },

  package: {
    individually: true
  }

}

module.exports = serverlessConfiguration;