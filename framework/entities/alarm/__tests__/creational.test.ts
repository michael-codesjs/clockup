
import { chance } from "@utilities/constants";
import { Given } from "@utilities/testing";
import { AlarmFactory } from "../index";

describe("AlarmEntityGroup Creational Tests", () => {

	let creator: ReturnType<typeof Given.user.absoluteEntity>;

	beforeEach(() => {
		creator = Given.user.absoluteEntity();
	});

	it("Creates AlarmEntityGroup.NullAlarm", async () => {
		const id = chance.guid();
		const creator = await Given.user.instance();
		const alarm = AlarmFactory.createEntity({ id: id, creator });
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
		const creator = await Given.user.instance();
		const preGetAttributes = (await Given.alarm.randomByCreator(creator))!; // create random alarm;
		const alarm = await AlarmFactory.createEntity({ id: preGetAttributes.alarm.id, creator }).sync();
		expect(preGetAttributes).toMatchObject(alarm.graphQlEntity());
	});

	it("Fails when AlarmEntityGroup.NullAlarm is given an id for a alarm that does not exist", async () => {
		const alarm = AlarmFactory.createEntity({ id: "some non existent alarm id", creator });
		try {
			await alarm.sync();
			expect(true).toBe(false); // if sync goes through without an error, fail the test
		} catch (error) {
			expect(true).toBe(true); // sync failed, we expect this to happen because the id we passed is for a non existent alarm
		}
	});

});