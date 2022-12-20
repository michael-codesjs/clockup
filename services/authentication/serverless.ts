import type { AWS } from "../../shared/typescript/types/aws";
import { cloudImports, common, generate } from "../../shared/typescript/utilities";
import { confirmSignUp } from "./functions";

const serverlessConfiguration: AWS.Service = {

	service: generate.serviceName("authentication"),

	frameworkVersion: "3",

	package: {
		individually: true
	},

	provider: {
		...common.providerSettings,
		environment: {
			...common.enviromentVariables,
			...cloudImports.topics,
			DYNAMO_DB_TABLE_NAME: common.enviromentResources.DYNAMO_DB_TABLE_NAME
		},
	},

	plugins: [
		...common.plugins
	],

	custom: {
		...common.custom,
		...common.pluginConfigs
	},

	functions: {
		confirmSignUp
	},

};

module.exports = serverlessConfiguration;
