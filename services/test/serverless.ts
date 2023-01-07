import { AWS } from "../../shared/typescript/types/aws";
import { resource, common } from "../../shared/typescript/utilities";
import { config } from "../../shared/typescript/utilities/constants";
import { generateServiceName } from "../../shared/typescript/utilities/functions";

/*
 * THIS SERVICE IS A UTILITY DEVELOPMENT SERVICE. YOU NEED NOT DEPLOY IT !
 * I simply use it to import resources that I can export to a .env file to test shared functionailty(eg: abstracts)
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
      TEST_TABLE_NAME: resource.test.tableName,
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
  }

};

module.exports = serverlessConfiguration;