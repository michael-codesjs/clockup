
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
			handler: "functions/update-user.handler",
			iamRoleStatements: [
				{
					Effect: "Allow",
					Action: ["dynamodb:UpdateItem", "dynamodb:GetItem"],
					Resource: [
						"${self:custom.tableArn}"
					]
				}
			]
		},

		deleteUser: {
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
		}

	}

};


module.exports = serverlessConfiguration;