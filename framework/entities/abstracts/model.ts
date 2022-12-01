import dynamoDbExpression from "@tuplo/dynoexpr";
import type { DeleteItemOutput, ExecuteTransactionOutput, GetItemOutput, PutItemOutput, UpdateItemOutput } from "aws-sdk/clients/dynamodb";
import { Entity } from ".";
import { dynamoDbOperations } from "../../../lib/dynamoDb";
import { configureEnviromentVariables } from "../../../utilities/functions";
import { ICreatable } from "./interfaces";

const { DYNAMO_DB_TABLE_NAME } = configureEnviromentVariables();

export class Model {

	readonly entity: Entity | (Entity & ICreatable);

	constructor(entity: Entity) {
		this.entity = entity;
	}

	/** put attributes  */
	protected putAttributes() {
		return {
			...this.entity.keys.all(),
			...this.entity.attributes.valid(),
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
		return { item: this.putAttributes(), params }
	}

	/** updatable attributes */
	protected updateAttributes() {

		const attributes = {
			...this.entity.keys.nonPrimary(),
			...this.entity.attributes.valid(),
			modified: new Date().toJSON()
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
			discontinued: true
		}
	}

	/** discontinue an entity */
	protected discontinueParams() {

		return dynamoDbExpression({
			Update: this.discontinueAttributes(),
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

	/** inserts an entities record into the table */
	async put(): Promise<PutItemOutput | ExecuteTransactionOutput> {
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

	async discontinue(): Promise<UpdateItemOutput | ExecuteTransactionOutput> {
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