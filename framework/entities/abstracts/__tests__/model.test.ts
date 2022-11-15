import { dynamoDbOperations } from "@lib/dynamoDb";
import { chance } from "@utilities/constants";
import { configureEnviromentVariables } from "@utilities/functions";
import { Model } from "../model";
import { Entity } from "./utilities/instantiable-abstracts";

const { DYNAMO_DB_TABLE_NAME } = configureEnviromentVariables();

describe("Model", () => {

	let entity: Entity;
	let model: Model;

	beforeAll(() => {
		entity = new Entity();
		model = new Model(entity);
	});

	test("Model.mutate to insert record into the table", async () => {
		entity.attributes.set({ attribute3: 10 });
		const result = await model.mutate();
		const record = await dynamoDbOperations.get({
			TableName: DYNAMO_DB_TABLE_NAME,
			Key: entity.keys.primary() as any
		});
		expect(result.Attributes).toMatchObject(record.Item);
	});

	test("Model.mutate to update a record in the table", async () => {
		entity.attributes.set({ attribute1: "value 1 mutated", attribute2: "value 2 mutated" });
		const result = await model.mutate();
		expect(result.Attributes).toMatchObject({
			...entity.attributes.collective(),
			...entity.keys.all()
		});
	});

	test("Model.mutate to update a record that does not exist fails", async () => {
    
		entity = new Entity({ id: chance.fbid() });
		model = new Model(entity);
    
		try {
			await model.mutate();
			throw new Error("Model.mutate operation was supposed to fail"); // fail test when mutate through successfully
		} catch(error:any) {
			expect(error.message).toBe("The conditional request failed");
		}

	});

});