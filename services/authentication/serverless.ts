import type { AWS } from "../../shared/typescript/types/aws";
import { resource, common, generate } from "../../shared/typescript/utilities";
import { confirmSignUp, preSignUp, deleteCognitoUser } from "./functions";

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
			USER_API_URL: resource.user.apiUrl,
			USER_REQUEST_QUEUE_URL: resource.user.requestQueueURL,
			USER_RESPONSE_QUEUE_URL: resource.user.responseQueueURL,
			AUTHENTICATION_REQUEST_QUEUE_URL: resource.authentication.requestQueueURL,
			AUTHENTICATION_RESPONSE_QUEUE_URL: resource.authentication.responseQueueURL,
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
		preSignUp,
		deleteCognitoUser
	},

};

module.exports = serverlessConfiguration;
