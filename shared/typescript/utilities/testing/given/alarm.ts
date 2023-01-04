import { Keys } from "../../../abstracts";
import { dynamoDbOperations } from "../../../lib/dynamoDb";
import { EntityType, Alarm as TAlarm } from "../../../types/api";
import { IntRange } from "../../../types/utility";
import { chance } from "../../../utilities/constants";
import { configureEnviromentVariables } from "../../../utilities/functions";
import { User } from "./user";

const { DYNAMO_DB_TABLE_NAME } = configureEnviromentVariables();
const TableName = DYNAMO_DB_TABLE_NAME!;

class GivenAlarmUtility {

	private constructor() { }
	static readonly instance = new GivenAlarmUtility();

	input() {

		const name = chance.sentence({ words: 5 });

		const time: TAlarm["time"] = {
			hour: chance.integer({ min: 0, max: 23 }) as IntRange<0, 24>,
			minute: chance.integer({ min: 0, max: 59 }) as IntRange<0, 60>
		};

		const snooze: TAlarm["snooze"] = {
			duration: [3, 5, 10][chance.integer({ min: 0, max: 2 })] as 3 | 5 | 10,
			interval: [3, 5][chance.integer({ min: 0, max: 1 })] as 3 | 5
		};

		const days: Array<IntRange<0, 7>> = (
			Array(chance.integer({ min: 0, max: 6 }))
				.fill(null)
				.map((...args) => {
					const array = args[2];
					let randomDay: number;
					do {
						randomDay = chance.integer({ min: 0, max: 6 });
					} while (array.includes(randomDay));
					return randomDay;
				})
		) as Array<IntRange<0, 7>>;

		const onceOff = chance.bool();
		const enabled = chance.bool();

		return { name, time, snooze, days, onceOff, enabled };

	}

	attributes() {

		const entityType = EntityType.Alarm;
		const id = chance.guid();
		const creatorType = EntityType.User;
		const creator = chance.guid();
		const created = chance.date().toJSON();
		const discontinued = false;

		return {
			entityType,
			id,
			creatorType,
			creator,
			created,
			discontinued,
			...this.input()
		};

	}

	/** same as input, only difference is the creator exists */
	async validInput() {

		const base = this.attributes();
		const creator = await User.new();

		return {
			creator: creator.id,
			...base
		};

	}

	async byId(id: string) {

		const key = Keys.constructKey({
			descriptors: [EntityType.Alarm],
			values: [id]
		}) as any;

		const result = await dynamoDbOperations.get({
			TableName,
			Key: {
				PK: key,
				SK: key
			}
		});

		return result.Item as TAlarm

	}

	async new(attributes?: TAlarm) {

		attributes = attributes || await this.validInput();
		
		const key = Keys.constructKey({
			descriptors: [EntityType.Alarm],
			values: [attributes.id]
		}) as any;

		
    const Item = {
      ...attributes,
      PK: key,
      SK: key
    } as any;
    
    await dynamoDbOperations.put({
      TableName,
      Item
    });

    return Item as TAlarm;

	}
	
	/*
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

	*/

}

export const Alarm = GivenAlarmUtility.instance;