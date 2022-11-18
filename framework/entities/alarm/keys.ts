import { Entity, Keys } from "../abstracts";
import { IAlarm } from "../abstracts/interfaces";

export class AlarmKeys extends Keys {

	public Entity: Entity & IAlarm;

	/** Sets user entity's desired GSIS keys */
	configure(): void {
    
	}

}