import { EntityType, ICommom, Alarm as AlarmType, AlarmSnoozeSettings, AlarmRingTime } from "@local-types/api";
import { AbsoluteUser, NullUser } from "@local-types/index";
import { IEntityFactory } from "@local-types/interfaces";
import { Entity, Model } from "../abstracts";
import { IAlarm, ICreatable } from "../abstracts/interfaces";
import { AlarmAttributes, EntityErrorTypes, NullAlarmAttributes, NullEntityAttributes } from "../types";
import { UserEntityFactory } from "../user";
import { AlarmModel, BaseAlarmModel } from "./model";


namespace AlarmEntityGroup {

  export class NullAlarm extends Entity implements ICreatable {

  	readonly TypeOfSelf = NullAlarm;
  	readonly NullTypeOfSelf = NullAlarm;
  	readonly AbsoluteTypeOfSelf = Alarm;

  	Creator: NullUser | AbsoluteUser;
  	protected PrimaryAttributes: string[];

  	protected model: Model = new BaseAlarmModel(this);

  	protected _constructor(params: Parameters<typeof NullAlarm.new>[0]) {
  		this.Creator = params.creator;
  	}

  	/** static creatonal method so that the constructor signature can match the base entity class */
  	static new(params:NullAlarmAttributes) {
  		const instance = new NullAlarm(params, EntityType.Alarm);
  		instance._constructor(params);
  		return instance;
  	}

  	protected set_GSI_keys(): void {}

  	attributes(): ICommom & Record<string, any> {
  		return null;
  	}

  	async sync(): Promise<Alarm> {
  		const { Item } = await this.model.get();
  		const creator = UserEntityFactory.createEntity({ id: Item.creator as string });
  		return Alarm.new({
  			...Item as AlarmAttributes,
  			creator
  		}) as any;
  	}

  	async terminate(): Promise<NullAlarm> {
  		// if you're gonna be deleting an alarm, provide a creator when instanciating it or sync it to obtain an absolute alarm.
  		if(!this.Creator) throw new Error(EntityErrorTypes.CREATABLE_TERMINATE_MISSING_CREATOR);
  		await this.model.delete();
  		return this;
  	}

  }

  export class Alarm extends Entity implements IAlarm {

  	readonly TypeOfSelf = Alarm;
  	readonly NullTypeOfSelf = NullAlarm;
  	readonly AbsoluteTypeOfSelf = Alarm;

  	protected readonly model: Model = new AlarmModel(this);

  	/* ATTRIBUTES */
  	public Creator: NullUser | AbsoluteUser;
  	protected Time: AlarmRingTime;
  	protected Snooze: AlarmSnoozeSettings;
  	protected Name: string = null;
  	readonly PrimaryAttributes = ["Time", "Snooze", "Creator"];

  	private _constructor(params: Parameters<typeof Alarm.new>[0]) {
  		this.setupAttributes(params);
  		this.setAttributes(params);
  	}

  	static new(params: AlarmAttributes) {
  		const instance = new Alarm(params, EntityType.Alarm);
  		instance._constructor(params);
  		return instance;
  	}

  	private setupAttributes(params: Parameters<typeof Alarm.new>[0]) {
  		const { creator, time, snooze } = params;
  		this.Creator = creator;
  		this.Time = time;
  		this.Snooze = snooze;
  	}

  	protected set_GSI_keys(): void {

  	}

  	attributes(): AlarmType {
  		return {
  			...super.attributes(),
  			creator: this.Creator.id,
  			name: this.Name,
  			snooze: this.Snooze,
  			time: this.Time,
  		};
  	}

  	graphQlEntity(): AlarmType {
  		return this.attributes();
  	}

  	async sync(): Promise<Alarm> {
  		const { Attributes } = await this.model.mutate();
  		delete Attributes.creator;
  		this.setAttributes(Attributes);
  		return this;
  	}

  	async put(): Promise<Alarm> {
  		if (!this.validatePrimaryAttributes()) throw new Error("Insufficient attributes provided for record creation.");
  		await this.model.put();
  		return this;
  	}

  	async terminate(): Promise<Alarm> {
  		await this.model.delete();
  		return this;
  	}

  }

}


/* AlarmEntiyGroup Factory */

type Attributes = NullAlarmAttributes | AlarmAttributes;
type AlarmVariant<T> =
  T extends AlarmAttributes ? AlarmEntityGroup.Alarm :
  T extends NullAlarmAttributes ? AlarmEntityGroup.NullAlarm : never;

/**
 * Factory used to obtain variants from the AlarmEntityGroup.
 * @param {Attribtues} params containing attributes that determine which variant from the AlarmEntityGroup the client gets.
 */

class Factory implements IEntityFactory {

	private constructor() { }
	static readonly instance = new Factory();

	createEntity<T extends Attributes>(params: T): AlarmVariant<T> | never {

		if (params && "creator" in params && ("snooze" in params || "time" in params)) {
			return AlarmEntityGroup.Alarm.new(params) as AlarmVariant<T>;
		} else if (params && "id" in params) {
			return AlarmEntityGroup.NullAlarm.new(params as any) as AlarmVariant<T>;
		} else {
			throw new Error("Can not instanciate variant of alarm");
		}

	}

}

export const AlarmEntityFactory = Factory.instance;