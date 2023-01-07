import dynamoDbExpression from "@tuplo/dynoexpr";
import type { DeleteItemOutput, ExecuteTransactionOutput, GetItemOutput, PutItemOutput, UpdateItemOutput } from "aws-sdk/clients/dynamodb";
import { Entity } from ".";
import { dynamoDbOperations } from "../lib/dynamoDb";

export class Model {

	readonly entity: Entity;
	readonly tableName: string;

	constructor(entity: Entity, tableName: string) {
		this.entity = entity;
		this.tableName = tableName;
	}

	/** put attributes  */
	protected putAttributes() {
		return {
			...this.entity.keys.all(),
			...this.entity.attributes.putable(),
		};
	}

	/** put params */
	protected putParams() {

		const params = dynamoDbExpression({
			Condition: {
				PK: "attribute_not_exists",
				SK: "attribute_not_exists"
			},
			ConditionLogicalOperator: "AND"
		});
		return { item: this.putAttributes(), params };
	}

	/** updatable attributes */
	protected updateAttributes() {

		const attributes = {
			...this.entity.keys.nonPrimary(),
			...this.entity.attributes.updateable(),
			modified: this.entity.attributes.get("modified") || new Date().toJSON()
		};

		delete attributes.created;
		delete attributes.discontinued;

		return attributes;

	}

	/** Dynamodb params for update operations on the table for the entity */
	private updateParams() {

		const attributes = this.updateAttributes();

		return dynamoDbExpression({
			Update: attributes as any,
			Key: this.entity.keys.primary(),
			ReturnValues: "ALL_NEW",
			Condition: {
				PK: "attribute_exists",
				SK: "attribute_exists",
				discontinued: false
			},
			ConditionLogicalOperator: "AND"
		});

	}

	/** attributes to be updated when discontinuing an entity */
	protected discontinueAttributes() {
		return {
			...this.entity.keys.nonPrimary(),
			modified: this.entity.attributes.get("modified") || new Date().toJSON(),
			discontinued: true
		};
	}

	/** discontinue an entity */
	protected discontinueParams() {

		return dynamoDbExpression({
			Update: this.discontinueAttributes(),
			Key: this.entity.keys.primary(),
			ReturnValues: "ALL_NEW",
			Condition: {
				...this.entity.keys.primary(),
				discontinued: false,
				creator: this.entity.attributes.get("creator")
			},
			ConditionLogicalOperator: "AND"
		});

	}

	/** inserts an entities record into the table */
	async put(): Promise<PutItemOutput | ExecuteTransactionOutput> {
		const { item, params } = this.putParams();
		return await dynamoDbOperations.put({
			TableName: this.tableName,
			Item: item as any,
			...params
		});
	}

	/** gets an entities record from the table using it's Partition and Sort key values */
	async get(): Promise<GetItemOutput> {
		return await dynamoDbOperations.get({
			TableName: this.tableName!,
			Key: this.entity.keys.primary() as any,
		});
	}

	/** updates an entities record in the table */
	async update(): Promise<UpdateItemOutput> {
		const params = this.updateParams();
		return await dynamoDbOperations.update({
			TableName: this.tableName!,
			...params as any
		});
	}

	async discontinue(): Promise<UpdateItemOutput | ExecuteTransactionOutput> {
		try {
			const params = this.discontinueParams();
			return await dynamoDbOperations.update({
				TableName: this.tableName,
				...params as any
			});
		} catch (error: any) {
			console.log("Err:", error);
		}
	}

	/** deletes an entities record from the table */
	async delete(): Promise<DeleteItemOutput | ExecuteTransactionOutput> {
		return await dynamoDbOperations.delete({
			TableName: this.tableName!,
			Key: this.entity.keys.primary() as any
		});
	}

}