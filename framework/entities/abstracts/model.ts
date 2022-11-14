import dynamoDbExpression from "@tuplo/dynoexpr";
import type { DeleteItemOutput, ExecuteTransactionOutput, GetItemOutput, UpdateItemOutput } from "aws-sdk/clients/dynamodb";
import { Entity } from ".";
import { dynamoDbOperations } from "../../../lib/dynamoDb";
import { configureEnviromentVariables } from "../../../utilities/functions";

const { DYNAMO_DB_TABLE_NAME } = configureEnviromentVariables();

/* Base Model for interacting with entity model */

export class Model {

	readonly entity: Entity;

	constructor(entity: Entity) {
		this.entity = entity;
	}

	/** Returns non null attributes that can be upserted to a table */
	private getNonNullAttributes(attributes: Record<string, any>): Record<string, any> {
		return Object.entries(attributes)
			.reduce((cumulative, current) => {
				const [key, value] = current;
				if (value === null || value === undefined) return cumulative;
				cumulative[key] = value;
				return cumulative;
			}, {});
	}

	/** DynamoDb item input for upsert operations on the table for the entity */
	private input() {
		const input = {
			...this.entity.keys.all(),
			...this.entity.attributes.collective(),
		};
		return this.getNonNullAttributes(input) as typeof input;
	}

	private upsertParams() {

		let attributes = this.input();
		let params: any;

		if (!this.entity.attributes.putable()) { // we don't have enough attributes to write the entity to the database so we assume we are trying to update the entity
			delete attributes.created; // never should we override created
			console.log("updating");
			params = dynamoDbExpression({
				Update: attributes,
				Key: this.entity.keys.primary(),
				ReturnValues: "ALL_NEW",
				Condition: {
					id: "attribute_exists"
				},
			});
		} else {
			delete attributes.PK;
			delete attributes.SK;
			params = dynamoDbExpression({
				Key: this.entity.keys.primary(),
				ReturnValues: "ALL_NEW",
				Update: attributes
			});
		}

		return params;

	}

	/** gets an entities record from the table using it's Partition and Sort key values */
	async get(): Promise<GetItemOutput> {
		return await dynamoDbOperations.get({
			TableName: DYNAMO_DB_TABLE_NAME!,
			Key: this.entity.keys.primary() as any,
		});
	}

	/** upserts an entities record in the table */
	async mutate(): Promise<UpdateItemOutput> {
		const params = this.upsertParams();
		return await dynamoDbOperations.update({
			TableName: DYNAMO_DB_TABLE_NAME!,
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