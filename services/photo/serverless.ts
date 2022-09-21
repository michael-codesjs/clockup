import { AWS } from "@local-types/aws";
import {
	commonPluginConfig,
	commonEnviromentVariables,
	commomEnviromentResources,
	commonCloudFormationImports,
	commonCustom,
	commonPlugins,
	commonProviderSettings
} from "@utilities/commons";


const serverlessConfiguration: AWS.Service = {

	service: "photo",

	provider: {
		...commonProviderSettings,
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

};

module.exports = serverlessConfiguration;