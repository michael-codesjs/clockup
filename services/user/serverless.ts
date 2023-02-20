import { AWS } from "../../shared/typescript/types/aws";
import { common, generate, resource } from "../../shared/typescript/utilities";
import { createEventsDataSource, createMappingTemplate, createStateMachineDataSource } from "../../shared/typescript/utilities/functions";
import * as functions from "./functions";
import { orchestrateUserCreatablesCleanUp } from "./state-machines";

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
			COGNITO_USER_POOL_ID: resource.authentication.userPoolId,
			COGNITO_CLIENT_ID: resource.authentication.userPoolWebClient,
			EVENT_BUS_NAME: resource.eventBusName,
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
				eventBusName: resource.eventBusName
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
				/*
				createMappingTemplate({
					field: "updateUser",
					type: "Mutation",
					source: "updateUser",
					request: "request.updateUser.vtl",
					response: "async-operation-response.vtl"
				})
				*/
			],
			dataSources: [
				// createDataSource("getProfile"),
				// createDataSource("updateUser"),
				createEventsDataSource({
					name: "deleteUser",
					eventBusArn: resource.eventBusArn
				}),
				/* createStateMachineDataSource({
				
					name: "updateUser",
					sync: false,
					stateMachineArn: "${self:resources.Outputs.UpdateUserStateMachineArn.Value}"
				}) */
			]
		},

	},

	...({
		stepFunctions: {
			stateMachines: {
				orchestrateUserCreatablesCleanUp
			}
		}
	}),

	functions,

	resources: {

		Resources: {

			OrchestrateUserCreatablesCleanUpStateMachineArnSSMParameter: {
				Type: "AWS::SSM::Parameter",
				Properties: {
					Name: "/clockup/user/${self:custom.stage}/state-machines/orchestrate-user-creatables-clean-up/arn",
					Type: "String",
					Value: { Ref: generate.stateMachineName("OrchestrateUserCreatablesCleanUp") },
					Tags: {
						Application: "clockup",
						Environment: "${self:custom.stage}",
						Service: "user"
					}
				}
			}

		},

		Outputs: {
			OrchestrateUserCreatablesCleanUpStateMachineArn: {
				Description: "Arn for the OrchestrateUserCreatablesCleanUp state machine.",
				Value: { Ref: generate.stateMachineName("OrchestrateUserCreatablesCleanUp") }
			}
		}

	}

};

module.exports = serverlessConfiguration;