import { s3BucketResource, dynamoDbResource } from "@resources";
import { AWS } from "../../shared/types/aws";
import { commonCustom, commonPluginConfig, commonPlugins, commonProviderSettings } from "../../shared/utilities/commons";
import { logicalResourceNames } from "../../shared/utilities/constants";
import { stacks } from "../../shared/utilities/stacks";
import { generateLogicalResourcelName, generateServiceName } from "../../shared/utilities/functions";

const slsInfrastructure: AWS.Service = {

	service: generateServiceName("root"),

	provider: {
		...commonProviderSettings
	},

	plugins: [
		...commonPlugins
	],

	package: {
		individually: true
	},

	custom: {
		...commonCustom,
		...commonPluginConfig,
		tableName: generateLogicalResourcelName("table"),
		userPoolName: generateLogicalResourcelName("userPool")
	},

	resources: {

		Resources: {
			...dynamoDbResource,
			...s3BucketResource
		},

		Outputs: {

			[stacks.root.outputs.table.name]: {
				Value: { Ref: logicalResourceNames.table },
				Export: { Name: stacks.root.outputs.table.name }
			},

			[stacks.root.outputs.table.arn]: {
				Value: { "Fn::GetAtt": [logicalResourceNames.table, "Arn"] },
				Export: { Name: stacks.root.outputs.table.arn }
			},

			[stacks.root.outputs.assetsBucket.name]: {
				Value: { Ref: logicalResourceNames.assetsBucket },
				Export: { Name: stacks.root.outputs.assetsBucket.name },
			},

			[stacks.root.outputs.assetsBucket.arn]: {
				Value: { "Fn::GetAtt": [logicalResourceNames.assetsBucket, "Arn"] },
				Export: { Name: stacks.root.outputs.assetsBucket.arn }
			},

			[stacks.root.outputs.tableStream.arn]: {
				Value: { "Fn::GetAtt": [logicalResourceNames.table, "StreamArn"] },
				Export: {
					Name: stacks.root.outputs.tableStream.arn,
				},
			},

		}
	}
};

module.exports = slsInfrastructure;