import Entities from "@entities";
import { AlarmRingTime, AlarmSnoozeSettings, EntityType } from "@local-types/api";
import { chance } from "@utilities/constants";
import { AbsoluteUserAttributes, AlarmAttributes } from "framework/entities/types";
import { ulid } from "ulid";
import { Authentication } from "../when/authentication";
import { User } from "./user";

class GivenAlarmUtility {

	private constructor() { }
	static readonly instance = new GivenAlarmUtility();

	attributes() {

		const entityType = EntityType.Alarm;
		const id = ulid();
		const name = chance.sentence({ words: 5 });
		const time: AlarmRingTime = {
			hour: chance.integer({ min: 0, max: 23 }),
			minute: chance.integer({ min: 0, max: 59 })
		};
		const snooze: AlarmSnoozeSettings = {
			duration: chance.integer({ min: 0, max: 10 }),
			interval: chance.integer({ min: 1, max: 5 })
		};

		return { entityType, id, name, time, snooze };

	}

	async byId(id: string) {
		try {
			const instance = await Entities.Alarm({ id }).sync(); // not sure if the user exists thus the exists: false, if we pass true, sync will throw an error
			return instance.graphQlEntity();
		} catch(error) {
			return null;
		}
	}

	async new(attributes: AlarmAttributes) {
		const instance = await Entities.Alarm(attributes).put();
		return instance.graphQlEntity();
	}

	async randomByCreator(creator: AlarmAttributes["creator"]) {
		const attributes = this.attributes();
		return await this.new({
			...attributes,
			creator
		});
	}

	async random() {
		const creator = Entities.User(await User.random());
		return await this.randomByCreator(creator);
	}
}

export const Alarm = GivenAlarmUtility.instance;