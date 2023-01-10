import type { AWS } from "../../shared/typescript/types/aws";
import { resource, common, generate } from "../../shared/typescript/utilities";
import { confirmSignUp, preSignUp } from "./functions";

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
			USER_TOPIC_ARN: resource.user.topicArn,
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
		confirmSignUp,
		preSignUp
	},

};

module.exports = serverlessConfiguration;
