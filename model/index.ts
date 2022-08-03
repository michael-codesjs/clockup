import { DynamoDB } from "aws-sdk"

export const dynamdoDbClient = new DynamoDB.DocumentClient();

export const dynamoDbOperations = {
  get: (params:AWS.DynamoDB.GetItemInput) => dynamdoDbClient.get(params).promise(),
  put: (params:AWS.DynamoDB.PutItemInput) => dynamdoDbClient.put(params).promise(),
}