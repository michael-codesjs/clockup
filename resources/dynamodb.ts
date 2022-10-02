
import { logicalResourceNames } from "../utilities/constants";

function GSI_Attribute_Definition(gsi: number) {
	return [
		{
			AttributeName: `GSI${gsi}_PK`,
			AttributeType: "S"
		},
		{
			AttributeName: `GSI${gsi}_SK`,
			AttributeType: "S"
		}
	];
}

function GSI_Schema(gsi: number) {
	return {
		IndexName: `GSI${gsi}`,
		KeySchema: [
			{
				AttributeName: `GSI${gsi}_PK`,
				KeyType: "HASH",
			},
			{
				AttributeName: `GSI${gsi}_SK`,
				KeyType: "RANGE",
			},
		],
		ProvisionedThroughput: {
			ReadCapacityUnits: 1,
			WriteCapacityUnits: 1
		},
		Projection: {
			ProjectionType: "ALL",
		}
	};
}

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

			GlobalSecondaryIndexes: [

				{
					// Entity Index GSI : GSI_0
					IndexName: "EntityIndex",
					KeySchema: [
						{
							AttributeName: "EntityIndexPK",
							KeyType: "HASH",
						},
						{
							AttributeName: "EntityIndexSK",
							KeyType: "RANGE",
						},
					],
					Projection: {
						ProjectionType: "ALL",
					},
					ProvisionedThroughput: {
						ReadCapacityUnits: 1,
						WriteCapacityUnits: 1
					}
				},
				GSI_Schema(1)
			],

			AttributeDefinitions: [
				{
					AttributeName: "PK",
					AttributeType: "S"
				},
				{
					AttributeName: "SK",
					AttributeType: "S"
				},
				{
					AttributeName: "EntityIndexPK",
					AttributeType: "S"
				},
				{
					AttributeName: "EntityIndexSK",
					AttributeType: "S"
				},
				...GSI_Attribute_Definition(1),
			],
			StreamSpecification: {
				StreamViewType: "NEW_AND_OLD_IMAGES",
			},
		}
	}
};