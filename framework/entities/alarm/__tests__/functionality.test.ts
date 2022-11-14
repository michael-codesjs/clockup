import { chance } from "@utilities/constants";
import { Given } from "@utilities/testing";
import { EntityErrorTypes } from "../../types";
import { UserEntityFactory } from "../../user/index.tsp";
import { AlarmEntityFactory } from "../alarm.tsp";


describe("AlarmEntityGroup Functionality Tests", () => {

	it("AlarmEntityGroup.Alarm Put Adds One To Creator's Record", async () => {
		const creator = await Given.user.absoluteEntity().put(); // create some random user
		const alarms = chance.integer({ min: 2, max: 10 }); // number of alarms we are going to create
		for(let x = 0; x < alarms; x++) {
			await Given.alarm.randomByCreator(creator); // create some random alarms by that random user
		}
		const creatorRecordPostAlarmCreation = await Given.user.byId(creator.id); // get the random users record
		expect(creatorRecordPostAlarmCreation.alarms).toBe(alarms); // check if record.alarms is equal the number of alarms we created
	});

	it("Partial Attribute Put Fails", async () => {
		const { time } = Given.alarm.attributes();
		const creator = Given.user.absoluteEntity();
		const alarm = AlarmEntityFactory.createEntity({ time, creator });
		try {
			await alarm.put();
			expect(true).toBe(false);
		} catch (error) {
			expect(error.message).toBe("Insufficient attributes provided for record creation.");
		}
	});

	it("Partial Attribute Update Does Not Nullify Exisiting Attributes In The Table", async () => {
		const preEditAttributes = (await Given.alarm.random())!;
		const { id } = preEditAttributes;
		const { name, time } = Given.alarm.attributes();
		const creator = UserEntityFactory.createEntity({ id: preEditAttributes.creator });
		const instance = await AlarmEntityFactory
			.createEntity({ creator, id, name, time })
			.sync();
		const postEditAttributes = instance.attributes();
		expect(postEditAttributes).toMatchObject({
			...preEditAttributes,
			name, time,
			modified: postEditAttributes.modified,
		});
	});

	it("AlarmEntityGroup.NullAlarm Termination", async () => {

		const preDeleteAttributes = await Given.alarm.random();

		const creator = UserEntityFactory.createEntity({ id: preDeleteAttributes.creator });
		const alarm = AlarmEntityFactory.createEntity({ id: preDeleteAttributes.id, creator });

		await alarm.terminate();
		const postDeleteRecord = await Given.alarm.byId(preDeleteAttributes.id);
		expect(postDeleteRecord).toBe(null);

		const user = await Given.user.byId(preDeleteAttributes.creator);
		expect(user.alarms).toBe(0);

	});


	it("AlarmEntityGroup.NullAlarm Termination Without Creator Fails", async () => {

		const preDeleteAttributes = await Given.alarm.random();
		const alarm = AlarmEntityFactory.createEntity({ id: preDeleteAttributes.id });

		try {
			await alarm.terminate();
			expect(true).toBe(false);
		} catch(error) {
			expect(error.message).toBe(EntityErrorTypes.CREATABLE_TERMINATE_MISSING_CREATOR);
		}

	});


	it("AlarmEntityGroup.Alarm Termination", async () => {

		const preDeleteAttributes = await Given.alarm.random();
		
		const creator = UserEntityFactory.createEntity({ id: preDeleteAttributes.creator });

		const alarm = AlarmEntityFactory.createEntity({ ...preDeleteAttributes, creator });

		await alarm.terminate();

		const postDeleteRecord = await Given.alarm.byId(preDeleteAttributes.id);
		expect(postDeleteRecord).toBe(null);

		const user = await Given.user.byId(preDeleteAttributes.creator);
		expect(user.alarms).toBe(0);

	});

});