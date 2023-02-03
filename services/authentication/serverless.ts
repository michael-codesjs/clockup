import type { AWS } from "../../shared/typescript/types/aws";
import { common, generate, resource } from "../../shared/typescript/utilities";
import { confirmSignUp, deleteCognitoUser, preSignUp, updateCognitoUser } from "./functions";

const serverlessConfiguration: AWS.Service = {

	service: generate.serviceName("authentication"),

	frameworkVersion: "3",

	package: {
		individually: true
	},

	provider: {

		...common.providerSettings,
		
		apiGateway: {
			restApiId: resource.authentication.apiId,
			restApiRootResourceId: resource.authentication.apiRootResourceId
		},

		environment: {
			...common.enviromentVariables,
			COGNITO_USER_POOL_ID: resource.authentication.userPoolId,
			COGNITO_CLIENT_ID: resource.authentication.userPoolWebClient,
			USER_TOPIC_ARN: resource.user.topicArn,
			USER_API_URL: resource.user.apiUrl,
			AUTHENTICATION_API_URL: resource.authentication.apiUrl,
			EVENT_BUS_NAME: resource.eventBusName,
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
		deleteCognitoUser,
		updateCognitoUser
	},

};

module.exports = serverlessConfiguration;
