
import { AWS } from "../../shared/types/aws";
import { cloudImports, common } from "../../shared/utilities";
import { generateServiceName } from "../../shared/utilities/functions";

const serverlessConfiguration: AWS.Service = {

	service: generateServiceName("user"),

	provider: {
		...common.providerSettings,
		environment: {
			...common.enviromentVariables,
			...common.enviromentResources,
		}
	},

	package: {
		individually: true
	},

	plugins: [
		...common.plugins
	],

	custom: {
		...common.custom,
		...common.pluginConfigs,
		...cloudImports.common,
		tableStreamArn: cloudImports.tableStreamArn,
		cognitoUserPoolArn: cloudImports.userPoolArn,
	},

	functions: {

		createUser: {
			description: "Creates a user.",
			handler: "functions/create-user.handler",
			iamRoleStatements: [
				{
					Effect: "Allow",
					Action: ["dynamodb:GetItem"],
					Resource: [
						"${self:custom.tableArn}"
					]
				}
			],
			events: [
				{
					cognitoUserPool: {
						pool: "clock-up-user-pool-${self:custom.stage}",
						existing: true,
						trigger: "PostConfirmation"
					}
				}
			]
		}

		/*
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
			description: "Deletes a user from our table.",
			handler: "functions/delete-user.handler",
			iamRoleStatements: [
				{
					Effect: "Allow",
					Action: ["dynamodb:GetItem", "dynamodb:UpdateItem"],
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
								eventName: ["MODIFY"],
								dynamodb: {
									NewImage: {
										EntityIndexPK: {
											S: [EntityType.User + "#discontinued"],
										}
									},
								},
							},
						],
					},
				},
			]
		}
		*/
	}

};


module.exports = serverlessConfiguration;