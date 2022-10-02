import { EntityType, ICommom, Alarm as AlarmType, AlarmSnoozeSettings, AlarmRingTime } from "@local-types/api";
import { AbsoluteUser, NullUser } from "@local-types/index";
import { IEntityFactory } from "@local-types/interfaces";
import { Entity, Model } from "../abstracts";
import { IAlarm } from "../abstracts/interfaces";
import { AlarmAttributes, NullAlarmAttributes } from "../types";
import { UserEntityFactory } from "../user";
import { AlarmModel } from "./model";


namespace AlarmEntityGroup {

  export class NullAlarm extends Entity {

    readonly TypeOfSelf = NullAlarm;
    readonly NullTypeOfSelf = NullAlarm;
    readonly AbsoluteTypeOfSelf = Alarm;

    protected PrimaryAttributes: string[];

    constructor(params: NullAlarmAttributes) {
      super(params, EntityType.Alarm)
    }

    protected set_GSI_keys(): void {

    }

    attributes(): ICommom & Record<string, any> {
      return null;
    }

    async sync(): Promise<Alarm> {
      const { Item } = await this.model.get();
      const creator = UserEntityFactory.createEntity({ id: Item.creator as string });
      return new Alarm({
        ...Item as AlarmAttributes,
        creator
      });
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

    constructor(params: AlarmAttributes) {
      super(params, EntityType.Alarm);
      this.setupAttributes(params);
      this.setAttributes(params);
    }

    private setupAttributes(params: ConstructorParameters<typeof Alarm>[0]) {
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
      }
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
      return new AlarmEntityGroup.Alarm(params) as AlarmVariant<T>;
    } else if (params && "id" in params) {
      return new AlarmEntityGroup.NullAlarm(params as any) as AlarmVariant<T>;
    } else {
      throw new Error("Can not instanciate variant of user");
    }

  }

}

export const AlarmEntityFactory = Factory.instance;