import type { AWS } from "@serverless/typescript";
import { common, generate, resource } from "../../shared/typescript/utilities";
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
			USER_TABLE_NAME: resource.user.tableName,
			USER_TOPIC_ARN: resource.user.topicArn,
			USER_REQUEST_QUEUE_ARN: resource.user.requestQueueArn,
			USER_REQUEST_QUEUE_URL: resource.user.requestQueueURL,
			AUTHENTICATION_RESPONSE_QUEUE_URL: resource.authentication.userPoolWebClient
			// USER_RESPONSE_QUEUE_ARN: resource.user.responseQueueArn,
			// USER_RESPONSE_QUEUE_URL: resource.user.responseQueueURL,
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
		// deleteUser
	}

};

module.exports = serverlessConfiguration;
