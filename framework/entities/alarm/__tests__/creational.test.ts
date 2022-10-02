
import { chance } from "@utilities/constants";
import { Given } from "@utilities/testing";
import { AlarmEntityFactory } from "..";

describe("AlarmEntityGroup Creational Tests", () => {

	it("Creates AlarmEntityGroup.NullAlarm", () => {
		const id = chance.guid();
		const alarm = AlarmEntityFactory.createEntity({ id: id });
		expect(alarm.TypeOfSelf).toBe(alarm.NullTypeOfSelf);
		expect(alarm.attributes()).toBe(null);
		expect(alarm.graphQlEntity()).toBe(null);
	});

	it("Creates AlarmEntityGroup.Alarm", () => {
		const attributes = Given.alarm.attributes();
		const creator = Given.user.absoluteEntity();
		const alarm = AlarmEntityFactory.createEntity({
			...attributes,
			creator
		});
		expect(alarm.TypeOfSelf).toBe(alarm.AbsoluteTypeOfSelf);
		expect(alarm.attributes()).toMatchObject({
			...attributes,
			creator: creator.id
		});
	});

	it("Create AlarmEntityGroup.Alarm from AlarmEntityGroup.NullAlarm", async () => {
		const attributes = (await Given.alarm.random())!; // create random alarm
		const alarm = await AlarmEntityFactory
			.createEntity({ id: attributes.id })
			.sync();
		expect(alarm.TypeOfSelf).toBe(alarm.AbsoluteTypeOfSelf);
		expect(alarm.attributes()).toMatchObject(attributes);
	});

	it("Fails when AlarmEntityGroup.NullAlarm is given an id for a alarm that does not exist", async () => {
		const alarm = AlarmEntityFactory.createEntity({ id: "some non existent alarm id" });
		try {
			await alarm.sync();
			expect(true).toBe(false); // if sync goes through without an error, fail the test
		} catch (error) {
			expect(true).toBe(true); // sync failed, we expect this to happen because the id we passed is for a non existent alarm
		}
	});

});