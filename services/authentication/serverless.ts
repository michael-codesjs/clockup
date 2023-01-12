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
			COGNITO_USER_POOL_ID: resource.authentication.userPoolId,
			COGNITO_CLIENT_ID: resource.authentication.userPoolWebClient,
			USER_TOPIC_ARN: resource.user.topicArn,
			USER_REQUEST_QUEUE_URL: resource.user.requestQueueURL,
			AUTHENTICATION_RESPONSE_QUEUE_URL: resource.authentication.responseQueueURL,
			USER_TABLE_NAME: resource.user.tableName // TODO: find a better way to export enviroment variables, user table should not be in scope in any way in this service
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
