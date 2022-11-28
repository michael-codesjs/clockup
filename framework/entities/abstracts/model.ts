import dynamoDbExpression from "@tuplo/dynoexpr";
import type { DeleteItemOutput, ExecuteTransactionOutput, GetItemOutput, PutItemOutput, UpdateItemOutput } from "aws-sdk/clients/dynamodb";
import { Entity } from ".";
import { dynamoDbOperations } from "../../../lib/dynamoDb";
import { configureEnviromentVariables } from "../../../utilities/functions";
import { ICreatable } from "./interfaces";

const { DYNAMO_DB_TABLE_NAME } = configureEnviromentVariables();

/* Base Model for interacting with entity model */

export class Model {

	readonly entity: Entity | (Entity & ICreatable);

	constructor(entity: Entity) {
		this.entity = entity;
	}

	/** DynamoDb item input for put operations on the table for the entity */
	private putParams() {
		const item = {
			...this.entity.keys.all(),
			...this.entity.attributes.valid(),
		};
		const params = dynamoDbExpression({
			Condition: {
				id: "attribute_not_exists"
			}
		});
		return { item, params }
	}

	/** updatable attributes */
	protected updateAttributes() {
		
		const attributes = {
			...this.entity.keys.nonPrimary(),
			...this.entity.attributes.valid()
		};

		delete attributes.created;
		delete attributes.discontinued;
		
		return attributes;

	}

	/** Dynamodb params for update operations on the table for the entity */
	private updateParams() {

		const attributes = this.updateAttributes();

		return dynamoDbExpression({
			Update: attributes,
			Key: this.entity.keys.primary(),
			ReturnValues: "ALL_NEW",
			Condition: {
				id: "attribute_exists",
				discontinued: false
			}
		});

	}

	private discontinueParams() {

		const attributes = {
			...this.entity.keys.nonPrimary(),
			discontinued: true
		}

		return dynamoDbExpression({
			Update: attributes,
			Key: this.entity.keys.primary(),
			ReturnValues: "ALL_NEW",
			Condition: {
				id: "attribute_exists",
				discontinued: false
			}
		});

	}

	/** inserts an entities record into the table */
	async put(): Promise<PutItemOutput> {
		const { item, params } = this.putParams();
		return await dynamoDbOperations.put({
			TableName: DYNAMO_DB_TABLE_NAME,
			Item: item as any,
			...params
		});
	}

	/** gets an entities record from the table using it's Partition and Sort key values */
	async get(): Promise<GetItemOutput> {
		return await dynamoDbOperations.get({
			TableName: DYNAMO_DB_TABLE_NAME!,
			Key: this.entity.keys.primary() as any,
		});
	}

	/** updates an entities record in the table */
	async update(): Promise<UpdateItemOutput> {
		const params = this.updateParams();
		return await dynamoDbOperations.update({
			TableName: DYNAMO_DB_TABLE_NAME!,
			...params as any
		});
	}

	async discontinue(): Promise<UpdateItemOutput> {
		const params = this.discontinueParams();
		return await dynamoDbOperations.update({
			TableName: DYNAMO_DB_TABLE_NAME,
			...params as any
		});
	}

	/** deletes an entities record from the table */
	async delete(): Promise<DeleteItemOutput | ExecuteTransactionOutput> {
		return await dynamoDbOperations.delete({
			TableName: DYNAMO_DB_TABLE_NAME!,
			Key: this.entity.keys.primary() as any
		});
	}

}