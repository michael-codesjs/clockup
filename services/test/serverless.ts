import { AWS } from "shared/types/aws";
import { commomEnviromentResources, commonCloudFormationImports, commonCustom, commonEnviromentVariables, commonPluginConfig, commonPlugins } from "@utilities/commons";
import { config } from "@utilities/constants";
import { stacks } from "@utilities/stacks";
import { generateServiceName, importLocalCloudFormationParam } from "../../utilities/functions";

/*
 * THIS SERVICE IS A UTILITY DEVELOPMENT SERVICE. YOU NEED NOT DEPLOY IT !
 * I import all cloudformation outputs here and use sls export-env to export the ouputs in a .env file
 * I then use those exports in my tests
 * Will probably grow to do more things
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
				output: stacks.authentication.outputs.cognito.id
			}),
			COGNITO_CLIENT_ID: importLocalCloudFormationParam({
				stack: "authentication",
				output: stacks.authentication.outputs.clients.web.id
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

};

module.exports = serverlessConfiguration;