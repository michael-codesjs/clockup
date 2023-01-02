import { Attributes } from "../../../shared/typescript/abstracts";
import { IEntityState } from "../../../shared/typescript/abstracts/interfaces";
import { Alarm as AlarmGraphQLEntity } from "../../../shared/typescript/types/api";
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
  attributes: Attributes<AlarmAttributesSchemaCollection>,
  sync(): Promise<Alarm>,
  graphQlEntity(): Promise<AlarmGraphQLEntity>
}