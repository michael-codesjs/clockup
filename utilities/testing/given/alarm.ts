import Entities from "@entities";
import { EntityType } from "@local-types/api";
import { AbsoluteUser } from "@local-types/index";
import { IntRange } from "@local-types/utility";
import { chance } from "@utilities/constants";
import { AlarmAttributes } from "framework/entities/types";
import { AlarmConstructorParams } from "framework/entities/types/constructor-params";
import { ulid } from "ulid";
import { User } from "./user";

class GivenAlarmUtility {

	private constructor() { }
	static readonly instance = new GivenAlarmUtility();

	attributes() {

		const entityType = EntityType.Alarm;
		const id = ulid();
		const name = chance.sentence({ words: 5 });
		const time: AlarmConstructorParams["time"] = {
			hour: chance.integer({ min: 0, max: 23 }) as IntRange<0, 24>,
			minute: chance.integer({ min: 0, max: 59 }) as IntRange<0, 60>
		};
		const snooze: AlarmConstructorParams["snooze"] = {
			duration: [3, 5, 10][chance.integer({ min: 0, max: 2 })] as 3 | 5 | 10,
			interval: [3, 5][chance.integer({ min: 0, max: 1 })] as 3 | 5
		};
		const days: Array<IntRange<0, 7>> = (
			Array(chance.integer({ min: 0, max: 6 }))
				.fill(null)
				.map((...args) => {
					const array = args[2];
					let randomDay: number
					do {
						randomDay = chance.integer({ min: 0, max: 6 });
					} while (array.includes(randomDay));
					return randomDay;
				})
		) as Array<IntRange<0, 7>>;
		const onceOff = chance.bool();
		const enabled = chance.bool();

		return { entityType, id, name, time, snooze, days, onceOff, enabled };

	}

	async byId(id: string, creator: AbsoluteUser) {
		try {
			const instance = await Entities.Alarm({ id , creator }).sync(); // not sure if the user exists thus the exists: false, if we pass true, sync will throw an error
			return instance.graphQlEntity();
		} catch (error) {
			return null;
		}
	}

	async new(attributes: AlarmConstructorParams) {
		const instance = Entities.Alarm(attributes)
		await instance.put();
		return instance.graphQlEntity();
	}

	async randomByCreator(creator: AlarmConstructorParams["creator"]) {
		const attributes = this.attributes();
		return await this.new({
			...attributes,
			creator
		});
	}

	async random() {
		const creator = await User.instance();
		return await this.randomByCreator(creator);
	}
	
}

export const Alarm = GivenAlarmUtility.instance;