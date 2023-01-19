import { dynamoDbOperations } from "../../lib/dynamoDb";
import { chance } from "../../utilities/constants";
import { configureEnviromentVariables } from "../../utilities/functions";
import { Entity } from "../../utilities/testing/instanciable-abstracts";
import { Model } from "../model";

const { TEST_TABLE_NAME } = configureEnviromentVariables();

describe("Model", () => {

	let entity: Entity;
	let model: Model;
	let created: Date;

	beforeAll(() => {
		entity = new Entity();
		model = new Model(entity, TEST_TABLE_NAME);
		created = new Date(entity.attributes.get("created"));
	});

	// TODO: decouple tests.

	test("Model.put to insert record into the table", async () => {

		entity.attributes.set({ attribute1: "string value", attribute2: "string value 2", attribute3: 10 });

		await model.put();

		const { Item } = await dynamoDbOperations.get({
			TableName: TEST_TABLE_NAME,
			Key: entity.keys.primary() as any
		});

		expect(Item).toMatchObject({
			...entity.keys.all(),
			...entity.attributes.putable()
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
			...entity.attributes.putable(),
			...entity.keys.all()
		});
	});

	test("Model.update to update a record in the table", async () => {
		entity.attributes.set({ attribute1: "value 1 mutated", attribute2: "value 2 mutated" });
		const result = await model.update();
		expect(result.Attributes).toMatchObject({
			...entity.attributes.updateable(),
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
		const model = new Model(entity, TEST_TABLE_NAME);

		try {
			await model.update();
			throw new Error("Model.update operation was supposed to fail"); // fail test when update goes through successfully
		} catch (error: any) {
			expect(error.message).toBe("The conditional request failed");
		}

	});

	test("Model.discontinue to discontinue an entity", async () => {

		await model.discontinue();

		const { Item } = await model.get();
		expect(Item.discontinued).toBe(true);

	});

	test("Model.update to update a discontinued entity fails", async () => {

		try {
			await model.update();
			throw new Error("Model.update operation was supposed to fail"); // fail test when mutate through successfully
		} catch (error: any) {
			expect(error.message).toBe("The conditional request failed");
		}

	});

	test("Model.continue to continue a discontinued entity.", async () => {

		await model.continue();
		const { Item } = await model.get();
		expect(Item.discontinued).toBe(false);

	});

});