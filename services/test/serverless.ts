import { AWS } from "../../types/aws";
import { commomEnviromentResources, commonCloudFormationImports, commonCustom, commonEnviromentVariables, commonPluginConfig, commonPlugins } from "../../utilities/commons";
import { config, stacks } from "../../utilities/constants";
import { generateServiceName, importLocalCloudFormationParam } from "../../utilities/functions";

/*
 * THIS SERVICE IS A UTILITY DEVELOPMENT SERVICE. YOU NEED NOT DEPLOY IT !
 * I import all cloudformation outputs here and use sls export-env to export the ouputs in a .env file
 * I then use the outputs in my tests.
 * Call me lazy but I don't want to be copy/pasting exports from CloudFormation into a .env file everytime I redeploy.
 */


const serverlessConfiguration: AWS.Service = {
  
  service: generateServiceName("test"),

  provider: {
    name: config.provider,
    stage: config.stage,
    region: config.region,
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

  package: {
    individually: true
  },

  plugins: [
    ...commonPlugins,
  ],

  custom: {
    ...commonCustom,
    ...commonPluginConfig,
    ...commonCloudFormationImports,
  }

}

module.exports = serverlessConfiguration;