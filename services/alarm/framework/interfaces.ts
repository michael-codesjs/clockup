import { Attributes } from "../../../shared/typescript/abstracts";
import { IEntityState, IStateableEntity } from "../../../shared/typescript/abstracts/interfaces";
import { AlarmResponse as AlarmGraphQLEntity } from "../../../shared/typescript/types/api";
import { AlarmAttributesSchemaCollection } from "./types";
import { Alarm } from "./alarm";

export interface IAlarmState extends IEntityState {
  context: Alarm,
  sync(): Promise<Alarm>,
  put(): Promise<Alarm>,
  discontinue(): Promise<Alarm>
  graphQlEntity(): Promise<AlarmGraphQLEntity>
}

export interface IAlarm {
  state: IAlarmState;
  attributes: Attributes<AlarmAttributesSchemaCollection>,
  sync(): Promise<Alarm>,
  graphQlEntity(): Promise<AlarmGraphQLEntity>
}