import type { AWS } from "@local-types/aws";
import { cognitoUserPoolResource, webCognitoClientResource } from "@resources";
import { logicalResourceNames } from "@utilities/constants";
import { stacks } from "@utilities/stacks";
import { commonCloudFormationImports, commonCustom, commonEnviromentVariables, commonPlugins, commonProviderSettings } from "@utilities/commons";
import { generateLogicalResourcelName, generateServiceName, importLocalCloudFormationParam } from "@utilities/functions";

const serverlessConfiguration: AWS.Service = {

	service: generateServiceName("authentication"),


	provider: {
		...commonProviderSettings,
		environment: {
			...commonEnviromentVariables,
			DYNAMO_DB_TABLE_NAME: importLocalCloudFormationParam({
				stack: "root",
				output: stacks.root.outputs.table.name
			})
		}

	},


	plugins: [
		...commonPlugins,
	],

	package: {
		individually: true
	},


	custom: {
		...commonCustom,
		userPoolName: generateLogicalResourcelName("userPool"),
		tableArn: commonCloudFormationImports.tableArn,
	},

	resources: {
    
		Resources: {
			...cognitoUserPoolResource,
			...webCognitoClientResource
		},

		Outputs: {

			[stacks.authentication.outputs.cognito.id]: {
				Value: { Ref: logicalResourceNames.userPool },
				Export: { Name: stacks.authentication.outputs.cognito.id },
			},

			[stacks.authentication.outputs.cognito.arn]: {
				Value: { "Fn::GetAtt": [logicalResourceNames.userPool, "Arn"] },
				Export: { Name: stacks.authentication.outputs.cognito.arn },
			},

			[stacks.authentication.outputs.clients.web.id]: {
				Value: { Ref: logicalResourceNames.userPoolWebClient },
				Export: { Name: stacks.authentication.outputs.clients.web.id }, 
			}

		}

	},

	functions: {

		/*
     * function logical names are tied to the LambdaConfig of the cognito user pool.
     * Only change them if you absolutely know what you are doing
     */
		confirmSignUp: {
			handler: "functions/confirm-user-sign-up.handler",
			iamRoleStatements: [
				{
					Effect: "Allow",
					Action: ["dynamodb:PutItem","dynamodb:UpdateItem"],
					Resource: [
						"${self:custom.tableArn}"
					]
				}
			],

			events: [
				{
					cognitoUserPool: {
						pool: logicalResourceNames.userPool,
						trigger: "PostConfirmation",
					}
				}
			],
		},

		preSignUp: {
			handler: "functions/pre-sign-up.handler",
			events: [
				{
					cognitoUserPool: {
						pool: logicalResourceNames.userPool,
						trigger: "PreSignUp"
					}
				}
			],
      
		}

	},

 

};

module.exports = serverlessConfiguration;