import dynamoDbExpression from "@tuplo/dynoexpr";
import type { DeleteItemOutput, ExecuteTransactionOutput, PutItemOutput, UpdateItemOutput } from "aws-sdk/clients/dynamodb";
import { Entity } from ".";
import { dynamoDbOperations } from "../lib/dynamoDb";
import { isLiteralObject } from "../utilities/functions";

export class Model {

	readonly entity: Entity;
	readonly tableName: string;

	constructor(entity: Entity, tableName: string) {
		this.entity = entity;
		this.tableName = tableName;
	}

	protected parseItemAttributes<I extends Record<string, any>>(Item: I): I {
		return Object.entries(Item)
			.reduce((cumulative, [key, value]) => {
				cumulative[key as keyof I] = isLiteralObject(value) && "wrapperName" in value && value.wrapperName === "Set" ? value.values : value;
				return cumulative;
			}, {} as I)
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
	protected continuityAttributes(discontinue: boolean) {
		return {
			...this.entity.keys.nonPrimary(),
			modified: this.entity.attributes.get("modified") || new Date().toJSON(),
			discontinued: discontinue
		};
	}

	/** discontinue an entity */
	protected continuityParams(discontinue = true) {

		return dynamoDbExpression({
			Update: this.continuityAttributes(discontinue),
			Key: this.entity.keys.primary(),
			ReturnValues: "ALL_NEW",
			Condition: {
				discontinued: !discontinue,
				creator: this.entity.attributes.get("creator"),
				creatorType: this.entity.attributes.get("creatorType")
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
	async get<T extends Record<string, any>>(): Promise<T> {

		const { Item } = await dynamoDbOperations.get({
			TableName: this.tableName!,
			Key: this.entity.keys.primary() as any,
		});

		return Item ? this.parseItemAttributes(Item as T) : null;

	}

	/** updates an entities record in the table */
	async update<T extends Record<string, any>>(): Promise<T> {
		
		const params = this.updateParams();
		const { Attributes } = await dynamoDbOperations.update({
			TableName: this.tableName!,
			...params as any
		});

		return this.parseItemAttributes(Attributes as T);

	}

	/** discontinues an entity */
	async discontinue(): Promise<UpdateItemOutput | ExecuteTransactionOutput> {
		const params = this.continuityParams(true);
		return await dynamoDbOperations.update({
			TableName: this.tableName,
			...params as any
		});
	}

	/** continues an entity */
	async continue(): Promise<UpdateItemOutput | ExecuteTransactionOutput> {
		const params = this.continuityParams(false);
		return await dynamoDbOperations.update({
			TableName: this.tableName,
			...params as any
		});
	}

	/** deletes an entities record from the table */
	async delete(): Promise<DeleteItemOutput | ExecuteTransactionOutput> {
		return await dynamoDbOperations.delete({
			TableName: this.tableName!,
			Key: this.entity.keys.primary() as any
		});
	}

}