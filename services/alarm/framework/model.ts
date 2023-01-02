import { Entity, Model } from "../../../shared/typescript/abstracts";
import { IAlarm } from "./interfaces";

export class AlarmModel extends Model {

	entity: Entity & IAlarm;

}