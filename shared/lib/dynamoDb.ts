import { DynamoDB } from "aws-sdk";

export const dynamoDbClient = new DynamoDB.DocumentClient();

export const dynamoDbOperations = {
	get: (params:DynamoDB.GetItemInput) => dynamoDbClient.get(params).promise(),
	put: (params:DynamoDB.PutItemInput) => dynamoDbClient.put(params).promise(),
	update: (params: DynamoDB.UpdateItemInput) => dynamoDbClient.update(params).promise(),
	delete: (params:DynamoDB.DeleteItemInput) => dynamoDbClient.delete(params).promise(),
	transactionWrite: (params: DynamoDB.TransactWriteItemsInput) => dynamoDbClient.transactWrite(params).promise()
};