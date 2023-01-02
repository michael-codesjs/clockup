import { Entity } from "../../../shared/typescript/abstracts";
import { IStateableEntity } from "../../../shared/typescript/abstracts/interfaces";
import { AlarmResponse } from "../../../shared/typescript/types/api";
import { AlarmAttributes } from "./attributes";
import { IAlarm, IAlarmState } from "./interfaces";
import { AlarmKeys } from "./keys";
import { Null } from "./states";
import { AbsoluteStateAlarmConstructorParams, NullStateAlarmConstructorParams, SemiStateAlarmConstructorParams } from "./types";

// type aliases
type N = NullStateAlarmConstructorParams;
type S = SemiStateAlarmConstructorParams;
type A = AbsoluteStateAlarmConstructorParams;

export class Alarm extends Entity implements IAlarm, IStateableEntity {

  readonly attributes: AlarmAttributes = new AlarmAttributes();
  readonly keys = new AlarmKeys(this);
  state: IAlarmState = new Null(this);

  constructor(attributes: N | S | A) {
    super();
    this.attributes.parse(attributes);
  }

  async graphQlEntity(): Promise<AlarmResponse> {
    return await this.state.graphQlEntity();
  }

  async sync(): Promise<Alarm> {
    return await this.state.sync();
  }

  async put(): Promise<Alarm> {
    return await this.state.put();
  }

  async discontinue(): Promise<Alarm> {
    return await this.state.discontinue();
  }

}
