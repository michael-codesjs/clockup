import { AlarmResponse, EntityType } from "@local-types/api";
import { AbsoluteUser } from "@local-types/index";
import { IEntityFactory } from "@local-types/interfaces";
import { Attributes, Entity, Keys } from "../abstracts";
import { IAlarm, ICreatable } from "../abstracts/interfaces";
import { EntityErrorMessages } from "../types";
import { Creatable } from "../types/attributes";
import { AlarmConstructorParams, NullCreatableEntityConstructorParams, UserConstructorParams } from "../types/constructor-params";
import { AlarmAttributes } from "./attributes";
import { AlarmModel } from "./model";

namespace AlarmEntityGroup {

	export class NullAlarm extends Entity implements ICreatable {

		readonly TypeOfSelf: typeof NullAlarm = NullAlarm;
		readonly NullTypeOfSelf: typeof NullAlarm = NullAlarm;
		readonly AbsoluteTypeOfSelf: typeof Alarm = Alarm; // typeof Alarm = Alarm;

		readonly creator: AbsoluteUser;
		readonly attributes: Attributes<Creatable> = new Attributes<Creatable>({ creator: { initial: null }});
		readonly keys: Keys = new Keys(this)

		constructor(params: NullCreatableEntityConstructorParams) {
			super();
			const { creator, id } = params;
			this.creator = creator;
			this.attributes.parse({ id, entityType: EntityType.Alarm, creator: creator.attributes.get("id") });
		}

		graphQlEntity(): null {
			return null
		}

		async sync(): Promise<Alarm> {
			const { Item } = await this.model.get();
			if (!Item) throw new Error(EntityErrorMessages.CREATABLE_BY_CREATOR_NOT_FOUND);
			return new Alarm({
				...Item as AlarmConstructorParams,
				creator: this.creator
			}) as any;
		}

	}

	export class Alarm extends Entity implements IAlarm {

		readonly TypeOfSelf: typeof Alarm = Alarm;
		readonly NullTypeOfSelf: typeof NullAlarm = NullAlarm;
		readonly AbsoluteTypeOfSelf: typeof Alarm = Alarm;

		model: AlarmModel = new AlarmModel(this);
		attributes: AlarmAttributes = new AlarmAttributes();
		keys = new Keys(this);

		creator: AbsoluteUser;

		constructor(attributes: AlarmConstructorParams) {
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
			const { Attributes } = await this.model.update();
			this.attributes.parse(Attributes);
			return this;
		}

	}

}

/* AlarmEntiyGroup Factory */

type AlarmFactoryParams = NullCreatableEntityConstructorParams | AlarmConstructorParams;
type AlarmVariant<T> =
	T extends UserConstructorParams ? AlarmEntityGroup.Alarm :
	T extends NullCreatableEntityConstructorParams ? AlarmEntityGroup.NullAlarm : never;

/**
 * Factory used to obtain variants from the AlarmEntityGroup.
 * @param {Attribtues | NullAlarmAttributes} params containing attributes that determine which variant from the AlarmEntityGroup the client gets.
 */

class AlarmFactoryBlueprint implements IEntityFactory {

	private constructor() { }
	static readonly instance = new AlarmFactoryBlueprint();

	createEntity<T extends AlarmFactoryParams>(params: T): AlarmVariant<T> {

		const isPartialAlarmParams = (params:T) => {
			return Object.keys(params).some((key) => ["name", "days", "time", "snooze", "onceOff"].includes(key));
		}

		if (isPartialAlarmParams(params) && "creator" in params) {
			return new AlarmEntityGroup.Alarm(params as AlarmConstructorParams) as AlarmVariant<T>;
		} else if (params && "id" in params && "creator" in params) {
			return new AlarmEntityGroup.NullAlarm(params as NullCreatableEntityConstructorParams) as AlarmVariant<T>;
		} else {
			throw new Error(EntityErrorMessages.ALARM_VARIANT_NOT_FOUND);
		}

	}

}

export const AlarmFactory = AlarmFactoryBlueprint.instance;