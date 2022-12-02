import { Given, Then } from "@utilities/testing";
import { EntityErrorMessages } from "../../types";
import { AlarmFactory } from "../alarm";


describe("AlarmEntityGroup Functionality Tests", () => {

	it("Partial Attribute Put Fails", async () => {
		const { time } = Given.alarm.attributes();
		const creator = Given.user.absoluteEntity();
		const alarm = AlarmFactory.createEntity({ id: "ID", time, creator });
		try {
			await alarm.put();
			expect(true).toBe(false);
		} catch (error) {
			expect(error.message).toBe(EntityErrorMessages.INSUFFICIENT_ATTRIBUTES_TO_PUT);
		}
	});

	it("Partial Attribute Update Does Not Nullify Exisiting Attributes In The Table", async () => {
		const creator = await Given.user.instance();
		const preEditAttributes = (await Given.alarm.randomByCreator(creator))!;
		const { id } = preEditAttributes.alarm;
		const { name, time } = Given.alarm.attributes();
		const instance = await AlarmFactory.createEntity({ creator, id, name, time }).sync();
		const postEditAttributes = instance.attributes.collective();
		expect(postEditAttributes).toMatchObject({
			...preEditAttributes.alarm,
			name, time,
			modified: Then.dateMatch(),
		});
	});

	it("AlarmEntityGroup.Alarm Discontinue", async () => {

		const creator = await Given.user.instance();
		const preDiscontinueAttributes = await Given.alarm.randomByCreator(creator);
		
		const alarm = await AlarmFactory.createEntity({ id: preDiscontinueAttributes.alarm.id, creator }).sync();

		await alarm.discontinue();
		const postDiscontinueRecord = await Given.alarm.byId(preDiscontinueAttributes.alarm.id, creator);
		expect(postDiscontinueRecord.alarm.discontinued).toBe(true);

		const { alarms } = await Given.user.byId(preDiscontinueAttributes.alarm.creator);
		expect(alarms).toBe(0);

	});

	test("AlarmEntityGroup.NullAlarm discontinuing without creator fails.", async () => {

		const creator = await Given.user.instance();
		const preDiscontinueAttributes = await Given.alarm.randomByCreator(creator); // create random alarm
		const alarm = AlarmFactory.createEntity({ id: preDiscontinueAttributes.alarm.id, creator });

		try {
			await alarm.discontinue();
			throw new Error("Was expecting discontinue to fail");
		} catch(error) {
			expect(error.message).toBe(EntityErrorMessages.NULL_VARIANT_RESTRICTION);
		}

	});

});