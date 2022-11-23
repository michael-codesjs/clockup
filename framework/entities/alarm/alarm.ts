import { Alarm as TAlarm, AlarmResponse, EntityType, ICommon } from "@local-types/api";
import { AbsoluteUser } from "@local-types/index";
import { IEntityFactory } from "@local-types/interfaces";
import { Attributes, Entity, Keys } from "../abstracts";
import { IAlarm, ICreatable } from "../abstracts/interfaces";
import { AlarmAttributes as TAlarmAttributes, EntityErrorMessages, NullAlarmAttributes } from "../types";
import { AlarmAttributes } from "./attributes";
import { AlarmKeys } from "./keys";

namespace AlarmEntityGroup {

	export class NullAlarm extends Entity implements ICreatable {

		readonly TypeOfSelf: typeof NullAlarm = NullAlarm;
		readonly NullTypeOfSelf: typeof NullAlarm = NullAlarm;
		readonly AbsoluteTypeOfSelf: any = Alarm; // typeof Alarm = Alarm;

		creator: AbsoluteUser;
		attributes: Attributes<{ creator: string } & ICommon> = new Attributes<{ creator: string } & ICommon>({ creator: { initial: null }});
		keys: Keys = new Keys(this)

		constructor(params: NullAlarmAttributes) {
			super();
			const { creator, id } = params;
			this.creator = creator;
			this.attributes.parse({ id, entityType: EntityType.Alarm });
		}

		graphQlEntity(): null {
			return null
		}

		async sync(): Promise<any> {
			const { Item } = await this.model.get();
			if (!Item) throw new Error(EntityErrorMessages.CREATABLE_BY_CREATOR_NOT_FOUND); // alarm does not belong to user
			return new Alarm({
				...Item as TAlarmAttributes,
				creator: this.creator
			}) as any;
		}

	}

	export class Alarm extends Entity implements IAlarm {

		readonly TypeOfSelf: typeof Alarm = Alarm;
		readonly NullTypeOfSelf: typeof NullAlarm = NullAlarm;
		readonly AbsoluteTypeOfSelf: typeof Alarm = Alarm;

		creator: AbsoluteUser;
		attributes: Attributes<TAlarm> = new AlarmAttributes();
		keys = new Keys(this);

		constructor(attributes: Omit<TAlarmAttributes,"entityType">) {
			super();
			const { creator, ...rest } = attributes;
			this.creator = creator;
			this.attributes.parse({ ...rest, creator: creator.attributes.get("id") });
		}

		graphQlEntity(): AlarmResponse {
			return {
				__typename: "AlarmResponse",
				alarm: this.attributes.collective(),
				creator: this.creator.attributes.collective()
			}
		}

		async sync(): Promise<Alarm> {
			const { Attributes } = await this.model.mutate();
			this.attributes.set(Attributes);
			return this;
		}

	}

}

/* AlarmEntiyGroup Factory */

type IAttributes = NullAlarmAttributes | AlarmAttributes;
type AlarmVariant<T> =
	T extends IAttributes ? AlarmEntityGroup.Alarm :
	T extends NullAlarmAttributes ? AlarmEntityGroup.NullAlarm : never;

/**
 * Factory used to obtain variants from the AlarmEntityGroup.
 * @param {Attribtues | NullAlarmAttributes} params containing attributes that determine which variant from the AlarmEntityGroup the client gets.
 */

class AlarmFactoryBlueprint implements IEntityFactory {

	private constructor() { }
	static readonly instance = new AlarmFactoryBlueprint();

	createEntity<T extends IAttributes>(params: T): AlarmVariant<T> | never {

		if (params && "creator" in params && ("snooze" in params || "time" in params)) {
			return new AlarmEntityGroup.Alarm(params) as AlarmVariant<T>;
		} else if (params && "id" in params) {
			return new AlarmEntityGroup.NullAlarm(params as any) as AlarmVariant<T>;
		} else {
			throw new Error(EntityErrorMessages.ALARM_VARIANT_NOT_FOUND);
		}

	}

}

export const AlarmFactory = AlarmFactoryBlueprint.instance;