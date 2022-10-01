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

	/** Returns non null attributes that can be upserted to a table */

	/** DynamoDb item input for upsert operations on the table for the entity */
	private entityDynamoDbPutItemInput() {
		return this.entity.nonNullAttributes({
			...this.entity.Keys.all(),
			...this.entity.attributes(),
		});
	}

	/** Returns non null attributes that can be upserted to a table */
	public entityUpdateItemParams() {
		const attributes = this.entity.nonNullAttributes({
			...this.entity.Keys.GSIs(),
			...this.entity.attributes()
		});
		delete attributes.created; // do not override created
		attributes.modified = new Date().toJSON();
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