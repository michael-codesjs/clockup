import { AWS } from "../../types/aws";
import { commomEnviromentResources, commonCloudFormationImports, commonCustom, commonEnviromentVariables, commonPluginConfig, commonPlugins } from "../../utilities/commons";
import { config } from "../../utilities/constants";
import { createDataSource, createMappingTemplate, generateServiceName } from "../../utilities/functions";


const serverlessConfiguration: AWS.Service = {

	service: generateServiceName("alarm"),

	provider: {
		name: config.provider,
		region: config.region,
		stage: config.stage,
		runtime: config.runtime,
		environment: {
			...commonEnviromentVariables,
			...commomEnviromentResources
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
		appSync: {
			apiId: "${self:custom.apiId}",
			schema: "../../schema.graphql",
			mappingTemplates: [
				createMappingTemplate({
					field: "createAlarm",
					type: "Mutation",
					source: "createAlarm"
				}),
				/*
				createMappingTemplate({
					field: "getAlarm",
					type: "Query",
					source: "getAlarm",
				}),
				createMappingTemplate({
					field: "getAlarms",
					type: "Query",
					source: "getAlarms",
				}),
				createMappingTemplate({
					field: "editAlarm",
					type: "Mutation",
					source: "editAlarm",
				}),
				createMappingTemplate({
					field: "deleteAlarm",
					type: "Query",
					source: "deleteAlarm",
				})
				*/
			],
			dataSources: [
				createDataSource("createAlarm")
				/*
				createDataSource("getAlarm"),
				createDataSource("getAlarms"),
				createDataSource("editAlarm"),
				createDataSource("editAlarm"),
				*/
			]
		},

	},

	functions: {
		createAlarm: {
			description: "Creates an alarm",
			handler: "functions/create-alarm.handler",
			iamRoleStatements: [
				{
					Effect: "Allow",
					Action: ["dynamodb:PutItem", "dynamodb:GetItem", "dynamodb:UpdateItem"], // PutItem to write alarm to table, GetItem to get user from table, UpdateItem to add +1 to alarms attribute of user record.
					Resource: "${self:custom.tableArn}"
				}
			]
		}
	}

};

module.exports = serverlessConfiguration;