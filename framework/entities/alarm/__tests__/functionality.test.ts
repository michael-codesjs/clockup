import { Given } from "@utilities/testing";
import { UserEntityFactory } from "../../user";
import { AlarmEntityFactory } from "../alarm";


describe("AlarmEntityGroup Functionality Tests", () => {
	
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

});