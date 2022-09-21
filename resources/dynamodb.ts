
import { logicalResourceNames } from "../utilities/constants";
import { generateLogicalResourcelName } from "../utilities/functions";

export const dynamoDbResource = {
	[logicalResourceNames.table]: {
		Type: "AWS::DynamoDB::Table",
		Properties: {
			TableName: "${self:custom.tableName}",
			ProvisionedThroughput: {
				ReadCapacityUnits: 1,
				WriteCapacityUnits: 1
			},
			KeySchema: [
				{
					AttributeName: "PK",
					KeyType: "HASH"
				},
				{
					AttributeName: "SK",
					KeyType: "RANGE"
				}
			],
			AttributeDefinitions: [
				{
					AttributeName: "PK",
					AttributeType: "S"
				},
				{
					AttributeName: "SK",
					AttributeType: "S"
				}
			]
		}
	}
};