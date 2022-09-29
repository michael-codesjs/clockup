import type { GetItemOutput, PutItemOutput, UpdateItemOutput, DeleteItemOutput } from "aws-sdk/clients/dynamodb";
import dynamoDbExpression from "@tuplo/dynoexpr";
import { Entity } from ".";
import { dynamoDbOperations } from "../../../lib/dynamoDb";
import { configureEnviromentVariables } from "../../../utilities/functions";

const { DYNAMO_DB_TABLE_NAME } = configureEnviromentVariables();

export class Model {

	readonly entity: Entity;

	constructor(entity: Entity) {
		this.entity = entity;
	}

	/** Returns non null attributes that can be inserted to a table */
	private getNonNullAttributes(attributes: Record<string, any>): Record<string, any> {
		return Object.entries(attributes)
			.reduce((cumulative, current) => {
				const [key, value] = current;
				if (value !== null || value !== undefined) {
					cumulative[key] = value;
				}
				return cumulative;
			}, {});
	}

	/** DynamoDb item input for upsert operations on the table for the entity */
	private entityDynamoDbPutItemInput() {
		return this.getNonNullAttributes({
			...this.entity.Keys.all(),
			...this.entity.attributes(),
		});
	}

	/** Returns non null attributes that can be upserted to a table */
	private entityUpdateItemParams() {
		const attributes = this.getNonNullAttributes({
			...this.entity.Keys.GSIs(),
			...this.entity.attributes()
		});
		const params = dynamoDbExpression({
			Update: attributes
		});
		return params;
	}

	/** gets an entities record from the table using it's Partition and Sort key values */
	async get(): Promise<GetItemOutput> {
		return await dynamoDbOperations.get({
			TableName: DYNAMO_DB_TABLE_NAME!,
			Key: this.entity.Keys.primary() as any,
		});
	}

	/** inserts a record of an entity into the table */
	async put(): Promise<PutItemOutput> {
		return await dynamoDbOperations.put({
			TableName: DYNAMO_DB_TABLE_NAME!,
			Item: this.entityDynamoDbPutItemInput() as any
		});
	}

	/** updates an entities record in the table */
	async mutate(): Promise<UpdateItemOutput> {
		const params = this.entityUpdateItemParams();
		return await dynamoDbOperations.update({
			TableName: DYNAMO_DB_TABLE_NAME!,
			Key: this.entity.Keys.primary(),
			...params as any,
			ReturnValues: "ALL_NEW"
		});

	}

	/** deletes an entities record from the table */
	async delete(): Promise<DeleteItemOutput> {
		return await dynamoDbOperations.delete({
			TableName: DYNAMO_DB_TABLE_NAME!,
			Key: this.entity.Keys.primary() as any
		});
	}

}