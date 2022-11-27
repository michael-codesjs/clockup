import { dynamoDbOperations } from "@lib/dynamoDb";
import dynamoDbExpression from "@tuplo/dynoexpr";
import { chance } from "@utilities/constants";
import { configureEnviromentVariables } from "@utilities/functions";
import { Model } from "../model";
import { Entity } from "@utilities/testing/instantiable-abstracts";
import { Then } from "@utilities/testing";

const { DYNAMO_DB_TABLE_NAME } = configureEnviromentVariables();

describe("Model", () => {

	let entity: Entity;
	let model: Model;
	let created: Date;

	beforeAll(() => {
		entity = new Entity();
		model = new Model(entity);
		created = new Date(entity.attributes.get("created"));
	});

	test("Model.put to insert record into the table", async () => {

		entity.attributes.set({ attribute1: "string value", attribute2: "string value 2", attribute3: 10 });

		await model.put();

		const { Item } = await dynamoDbOperations.get({
			TableName: DYNAMO_DB_TABLE_NAME,
			Key: entity.keys.primary() as any
		});

		expect(Item).toMatchObject({
			...entity.keys.all,
			...entity.attributes.valid()
		});

	});

	test("Model.put to insert record into table that already exists fails", async () => {

		try {
			await model.put();
			throw new Error("We expect condition check on put to fail.");
		} catch (error: any) {
			expect(error.name).toBe("ConditionalCheckFailedException");
		}

	});

	test("Model.get to get a record from the table", async () => {
		const { Item } = await model.get();
		expect(Item).toMatchObject({
			...entity.attributes.valid(), // non null attributes
			...entity.keys.all(),
			modified: Then.dateMatch()
		});
	});

	test("Model.update to update a record in the table", async () => {
		entity.attributes.set({ attribute1: "value 1 mutated", attribute2: "value 2 mutated" });
		const result = await model.update();
		expect(result.Attributes).toMatchObject({
			...entity.attributes.valid(),
			...entity.keys.all()
		});
	});

	test("Model.update does not mutate attributes (created & discontinued)", async () => {
		
		entity.attributes.parse({
			...entity.attributes.valid(),
			discontinued: true,
			created: new Date().toJSON()
		});

		const { Attributes } = await model.update();

		const postUpdateCreated = new Date((Attributes as any).created);
		const postUpdateDiscontinued = Attributes.discontinued;

		expect(postUpdateCreated.valueOf()).toBe(created.valueOf());
		expect(postUpdateDiscontinued).toBe(false);

	});

	test("Model.update to update a record that does not exist fails", async () => {

		const entity = new Entity({ id: chance.fbid() });
		const model = new Model(entity);

		try {
			await model.update();
			throw new Error("Model.update operation was supposed to fail"); // fail test when mutate through successfully
		} catch (error: any) {
			expect(error.message).toBe("The conditional request failed");
		}

	});

	test("Model.update to update a discontinued entity fails", async () => {

		const discontinueParams = dynamoDbExpression({
			Update: { discontinued: true },
			Key: entity.keys.primary(),
		});

		await dynamoDbOperations.update({
			TableName: DYNAMO_DB_TABLE_NAME,
			...discontinueParams as any
		});

		entity.attributes.set({
			attribute1: "value post discontinue"
		});

		try {
			await model.update();
			throw new Error("Model.update operation was supposed to fail"); // fail test when mutate through successfully
		} catch (error: any) {
			expect(error.message).toBe("The conditional request failed");
		}

	});

});