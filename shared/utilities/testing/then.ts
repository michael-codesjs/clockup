
import * as types from "shared/types/api";

export class ThenUtility {

	readonly operand: any;

	constructor(operand:any) {
		this.operand = operand;
	}

	readonly dateMatch = () => expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/g);

	/** tests one object against the other for user attributes */
	user(object:any) {
		const { id, name, email, alarms } = object;
		expect(this.operand).toMatchObject({
			id, name, email, alarms,
			entityType: types.EntityType.User,
		});
	}

	poolUser(object:any) {
		const { id, name, email } = object;
		expect(this.operand).toMatchObject({
			sub: id,
			name, email
		});
	}

	alarm(object:any) {
		const { id, name, time, snooze, days, onceOff, enabled } = object;
		expect(this.operand).toMatchObject({
			id, name, time, snooze, days, onceOff, enabled,
			entityType: types.EntityType.Alarm,
		});
	}

}

export const Then = (operand:any) => new ThenUtility(operand);