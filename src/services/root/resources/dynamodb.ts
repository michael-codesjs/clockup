
import { generateLogicalResourcelName } from "../../../utilities/functions";

export const dynamoDbResource = {
  Type: "AWS::DynamoDB::Table",
  Properties: {
    TableName: generateLogicalResourcelName("table"),
    ProvisionedThroughput: {
      ReadCapacityUnits: 1,
      WriteCapacityUnits: 1
    },
    KeySchema: [
      {
        AttributeName: "id",
        KeyType: "HASH"
      }
    ],
    AttributeDefinitions: [
      {
        AttributeName: "id",
        AttributeType: "S"
      }
    ]
  }
}