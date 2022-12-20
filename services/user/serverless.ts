import type { AWS } from "@serverless/typescript";
import { common, generate } from "../../shared/typescript/utilities";
import { createUser } from "./functions";

const serverlessConfiguration: AWS = {

	service: generate.serviceName("user"),

	frameworkVersion: "3",

	plugins: [
		...common.plugins
	],

	provider: {
		...common.providerSettings,
		environment: {
			...common.enviromentVariables,
			...common.enviromentResources,
		},
	},

	package: {
		individually: true
	},

	custom: {
		...common.pluginConfigs,
		...common.custom
	},

	functions: {
		createUser
	}

};

module.exports = serverlessConfiguration;
