
import { Given } from "@utilities/testing";
import { AlarmFactory } from "../index.tsp";

describe("AlarmEntityGroup Creational Tests", () => {

	/** TODO: fix */
	
	/*
	it("Creates AlarmEntityGroup.NullAlarm", () => {
		const id = chance.guid();
		const alarm = AlarmFactory.createEntity({ id: id });
		expect(alarm.TypeOfSelf).toBe(alarm.NullTypeOfSelf);
		expect(alarm.graphQlEntity()).toBe(null);
	});


	it("Creates AlarmEntityGroup.Alarm", () => {
		const attributes = Given.alarm.attributes();
		const creator = Given.user.absoluteEntity();
		const alarm = AlarmFactory.createEntity({
			...attributes,
			creator
		});
		expect(alarm.TypeOfSelf).toBe(alarm.AbsoluteTypeOfSelf);
		expect(alarm.attributes.collective()).toMatchObject({
			...attributes,
			creator: creator.attributes.get("id")
		});
	});

	it("Create AlarmEntityGroup.Alarm from AlarmEntityGroup.NullAlarm", async () => {
		const attributes = (await Given.alarm.random())!; // create random alarm
		const alarm = await AlarmFactory.createEntity({ id: attributes.alarm.id }).sync();
		expect(alarm.TypeOfSelf).toBe(alarm.AbsoluteTypeOfSelf);
		expect(alarm.attributes.collective()).toMatchObject(attributes);
	});

	/*

	it("Fails when AlarmEntityGroup.NullAlarm is given an id for a alarm that does not exist", async () => {
		const alarm = AlarmEntityFactory.createEntity({ id: "some non existent alarm id" });
		try {
			await alarm.sync();
			expect(true).toBe(false); // if sync goes through without an error, fail the test
		} catch (error) {
			expect(true).toBe(true); // sync failed, we expect this to happen because the id we passed is for a non existent alarm
		}
	});

	*/

});