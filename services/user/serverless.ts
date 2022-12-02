
import { AWS } from "../../types/aws";
import {
	commomEnviromentResources,
	commonCloudFormationImports,
	commonCustom,
	commonEnviromentVariables,
	commonPluginConfig,
	commonPlugins
} from "@utilities/commons";
import { config } from "@utilities/constants";
import { stacks } from "@utilities/stacks";
import { createDataSource, createMappingTemplate, generateServiceName, importLocalCloudFormationParam } from "@utilities/functions";
import { EntityType } from "@local-types/api";

const serverlessConfiguration: AWS.Service = {

	service: generateServiceName("user"),

	provider: {
		name: config.provider,
		region: config.region,
		stage: config.stage,
		runtime: config.runtime,
		environment: {
			...commonEnviromentVariables,
			...commomEnviromentResources,
			COGNITO_USER_POOL_ID: importLocalCloudFormationParam({
				stack: "authentication",
				output: stacks.authentication.outputs.cognito.id
			}),
			COGNITO_CLIENT_ID: importLocalCloudFormationParam({
				stack: "authentication",
				output: stacks.authentication.outputs.clients.web.id
			})
		}
	},

	plugins: [
		...commonPlugins,
		"serverless-appsync-plugin",
	],

	custom: {

		...commonCustom,
		...commonPluginConfig,
		...commonCloudFormationImports,
		tableStreamArn: commonCloudFormationImports.tableStreamArn,
		cognitoUserPoolArn: importLocalCloudFormationParam({
			stack: "authentication",
			output: stacks.authentication.outputs.cognito.arn
		}),

		appSync: {
			apiId: "${self:custom.apiId}",
			schema: "../../schema.graphql",
			mappingTemplates: [
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
				createMappingTemplate({
					field: "deleteUser",
					type: "Mutation",
					source: "deleteUser",
				})
			],
			dataSources: [
				createDataSource("getProfile"),
				createDataSource("updateUser"),
				createDataSource("deleteUser")
			]
		},

	},

	functions: {

		getProfile: {
			description: "Gets a user information",
			handler: "functions/get-profile.handler",
			iamRoleStatements: [
				{
					Effect: "Allow",
					Action: ["dynamodb:GetItem"],
					Resource: [
						"${self:custom.tableArn}"
					]
				}
			]
		},

		updateUser: {
			description: "Updates a user with the supplied attributes",
			handler: "functions/update-user.handler",
			iamRoleStatements: [
				{
					Effect: "Allow",
					Action: ["dynamodb:UpdateItem", "dynamodb:GetItem"],
					Resource: [
						"${self:custom.tableArn}"
					]
				},
				{
					Effect: "Allow",
					Action: ["cognito-idp:AdminUpdateUserAttributes"],
					Resource: [
						"${self:custom.cognitoUserPoolArn}"
					]
				}
			]
		},

		deleteUser: {
			description: "Deletes a user from our table on their request",
			handler: "functions/delete-user.handler",
			iamRoleStatements: [
				{
					Effect: "Allow",
					Action: ["dynamodb:DeleteItem"],
					Resource: [
						"${self:custom.tableArn}"
					]
				}
			]
		},

		syncUserDiscontinueWithCognito: {
			description: "Disables a user in cognito when they are discontinued from our table",
			handler: "functions/sync-user-discontinue-with-cognito.handler",
			iamRoleStatements: [
				{
					Effect: "Allow",
					Action: ["cognito-idp:AdminDisableUser"],
					Resource: [
						"${self:custom.cognitoUserPoolArn}"
					]
				}
			],
			events: [
				{
					stream: {
						type: "dynamodb",
						arn: "${self:custom.tableStreamArn}",
						maximumRetryAttempts: 2,
						batchSize: 1,
						filterPatterns: [
							{
								eventName: ["UPDATE"],
								dynamodb: {
									OldImage: {
										EntityIndexPK: {
											S: [EntityType.User],
										},
										discontinued: {
											B: [true]
										}
									},
								},
							},
						],
					},
				},
			]
		}

	}

};


module.exports = serverlessConfiguration;