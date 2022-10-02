import { dynamoDbOperations } from "@lib/dynamoDb";
import { configureEnviromentVariables } from "@utilities/functions";
import { ExecuteTransactionOutput } from "aws-sdk/clients/dynamodb";
import { Entity, Model } from "../abstracts";
import { ICreatable } from "../abstracts/interfaces";

const { DYNAMO_DB_TABLE_NAME } = configureEnviromentVariables();

export class BaseAlarmModel extends Model {
  
	entity: Entity & ICreatable;

	async delete(): Promise<ExecuteTransactionOutput> {
		return await dynamoDbOperations.transactionWrite({
			TransactItems: [
				{
					Delete: {
						TableName: DYNAMO_DB_TABLE_NAME,
						Key: this.entity.Keys.primary() as any
					}
				},
				{
					Update: {
						TableName: DYNAMO_DB_TABLE_NAME!,
						Key: {
							...this.entity.Creator.Keys.primary() as any
						},
						UpdateExpression: "ADD alarms :one",
						ExpressionAttributeValues: {
							":one": -1 as any
						},
						ConditionExpression: "attribute_exists(PK)"
					}
				}
			]
		});
	}

}

export class AlarmModel extends BaseAlarmModel {

	entity: Entity & ICreatable;

	async put(): Promise<ExecuteTransactionOutput> {
		return await dynamoDbOperations.transactionWrite({
			TransactItems: [
				{
					// Put alarm record into table
					Put: {
						TableName: DYNAMO_DB_TABLE_NAME!,
						Item: this.entityDynamoDbPutItemInput(),
						ConditionExpression: "attribute_not_exists(PK)"
					}
				},
				{
					// Update user record to have +1 alarms
					Update: {
						TableName: DYNAMO_DB_TABLE_NAME!,
						Key: {
							...this.entity.Creator.Keys.primary() as any
						},
						UpdateExpression: "ADD alarms :one",
						ExpressionAttributeValues: {
							":one": 1 as any
						},
						ConditionExpression: "attribute_exists(PK)"
					}
				}
			]
		});
	}

}