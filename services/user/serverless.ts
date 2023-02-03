import { AWS } from "../../shared/typescript/types/aws";
import { common, generate, resource } from "../../shared/typescript/utilities";
import { createMappingTemplate, createStateMachineDataSource } from "../../shared/typescript/utilities/functions";
import { continueUser, createUser, getUser, discontinueUser, handleDeleteCognitoUserTaskToken } from "./functions";
import { deleteUser, updateUser } from "./state-machines";

const serverlessConfiguration: AWS.Service = {

	service: generate.serviceName("user"),
	frameworkVersion: "3",

	plugins: [
		...common.plugins,
		"serverless-step-functions",
		"serverless-appsync-plugin"
	],

	provider: {
		...common.providerSettings,
		apiGateway: {
			restApiId: resource.user.apiId,
			restApiRootResourceId: resource.user.apiRootResourceId,

		},
		environment: {
			...common.enviromentVariables,
			...common.enviromentResources,
			USER_TABLE_NAME: resource.user.tableName,
			USER_API_URL: resource.user.apiUrl,
			USER_TOPIC_ARN: resource.user.topicArn,
			USER_REQUEST_QUEUE_ARN: resource.user.requestQueueArn,
			USER_REQUEST_QUEUE_URL: resource.user.requestQueueURL,
			AUTHENTICATION_RESPONSE_QUEUE_URL: resource.authentication.userPoolWebClient,
			COGNITO_USER_POOL_ID: resource.authentication.userPoolId,
			COGNITO_CLIENT_ID: resource.authentication.userPoolWebClient,
			// DELETE_USER_STATE_MACHINE_ARN: "${self:resources.Outputs.DeleteUserStateMachineArn.Value}"
			// USER_RESPONSE_QUEUE_ARN: resource.user.responseQueueArn,
		},
	},

	package: {
		individually: true
	},

	custom: {
		...common.pluginConfigs,
		...common.custom,
		appSync: {
			apiId: resource.api.graphQlApiId,
			schema: "../../shared/graphql/schema.graphql",
			substitutions: {
				deleteUserStateMachineArn: "${self:resources.Outputs.DeleteUserStateMachineArn.Value}",
				deleteUserStateMachineName: generate.stateMachineName("DeleteUser")
			},
			mappingTemplates: [
				/*
				createMappingTemplate({
					field: "getProfile",
					type: "Query",
					source: "getProfile",
				}),
				createMappingTemplate({
					field: "updateUser",
					type: "Mutation",
					source: "updateUser",
				}),
				*/
				createMappingTemplate({
					field: "deleteUser",
					type: "Mutation",
					source: "deleteUser",
					request: "request.deleteUser.vtl",
					response: "async-operation-response.vtl"
				}),
				createMappingTemplate({
					field: "updateUser",
					type: "Mutation",
					source: "updateUser",
					request: "request.updateUser.vtl",
					response: "async-operation-response.vtl"
				})
			],
			dataSources: [
				// createDataSource("getProfile"),
				// createDataSource("updateUser"),
				createStateMachineDataSource({
					name: "deleteUser",
					sync: false,
					stateMachineArn: "${self:resources.Outputs.DeleteUserStateMachineArn.Value}"
				}),
				createStateMachineDataSource({
					name: "updateUser",
					sync: false,
					stateMachineArn: "${self:resources.Outputs.UpdateUserStateMachineArn.Value}"
				})
			]
		},

	},

	functions: {
		createUser,
		getUser,
		discontinueUser,
		continueUser,
		handleDeleteCognitoUserTaskToken
	},

	...({
		stepFunctions: {
			stateMachines: {
				deleteUser,
				updateUser
			}
		}
	}),

	resources: {

		Resources: {

			DeleteUserStateMachineArnSSMParameter: {
				Type: "AWS::SSM::Parameter",
				Properties: {
					Name: "/clockup/user/${self:custom.stage}/state-machines/delete-user/arn",
					Type: "String",
					Value: { Ref: generate.stateMachineName("DeleteUser") },
					Tags: {
						Environment: "${self:custom.stage}"
					}
				}
			},

			UpdateUserUserStateMachineArnSSMParameter: {
				Type: "AWS::SSM::Parameter",
				Properties: {
					Name: "/clockup/user/${self:custom.stage}/state-machines/update-user/arn",
					Type: "String",
					Value: { Ref: generate.stateMachineName("UpdateUser") },
					Tags: {
						Environment: "${self:custom.stage}"
					}
				}
			}

		},

		Outputs: {
			DeleteUserStateMachineArn: {
				Description: "Arn for the deleteUser state machine.",
				Value: { Ref: generate.stateMachineName("DeleteUser") }
			},
			UpdateUserStateMachineArn: {
				Description: "Arn for the updateUser state machine.",
				Value: { Ref: generate.stateMachineName("UpdateUser") }
			}
		}

	}

};

module.exports = serverlessConfiguration;