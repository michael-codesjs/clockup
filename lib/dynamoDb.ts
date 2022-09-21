import { DynamoDB } from "aws-sdk";

export const dynamdoDbClient = new DynamoDB.DocumentClient();

export const dynamoDbOperations = {
	get: (params:DynamoDB.GetItemInput) => dynamdoDbClient.get(params).promise(),
	put: (params:DynamoDB.PutItemInput) => dynamdoDbClient.put(params).promise(),
	update: (params: DynamoDB.UpdateItemInput) => dynamdoDbClient.update(params).promise(),
	delete: (params:DynamoDB.DeleteItemInput) => dynamdoDbClient.delete(params).promise()
};