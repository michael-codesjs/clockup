import type { AWS } from "@serverless/typescript";
import { cloudImports, common, generate } from "../../shared/typescript/utilities";
import { createUser, deleteUser } from "./functions";

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
			USER_TOPIC_ARN: cloudImports.userTopicArn
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
		createUser,
		deleteUser
	}

};

module.exports = serverlessConfiguration;
