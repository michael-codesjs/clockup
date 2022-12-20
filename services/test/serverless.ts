import { AWS } from "../../shared/typescript/types/aws";
import { cloudImports, common } from "../../shared/typescript/utilities";
import { config } from "../../shared/typescript/utilities/constants";
import { generateServiceName } from "../../shared/typescript/utilities/functions";

/*
 * THIS SERVICE IS A UTILITY DEVELOPMENT SERVICE. YOU NEED NOT DEPLOY IT !
 * I simply use it import every enviroment variable I can think of that is used by every services.
 * I then export then enviroment variables to a dotenv file to be used in my tests.
 */


const serverlessConfiguration: AWS.Service = {

  service: generateServiceName("test"),

  provider: {
    name: config.provider,
    stage: config.stage,
    region: config.region,
    runtime: config.runtime,
    environment: {
      ...common.enviromentVariables,
      ...common.enviromentResources,
      COGNITO_USER_POOL_ID: cloudImports.userPoolId,
      COGNITO_CLIENT_ID: cloudImports.userPoolWebClient
    }
  },

  package: {
    individually: true
  },

  plugins: [
    ...common.plugins,
  ],

  custom: {
    ...common.custom,
    ...common.pluginConfigs,
    ...cloudImports.common,
  }

};

module.exports = serverlessConfiguration;