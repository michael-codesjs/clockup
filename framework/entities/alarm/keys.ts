import { Entity, Keys } from "../abstracts";
import { IAlarm } from "../abstracts/interfaces";

export class AlarmKeys extends Keys {

	public Entity: Entity & IAlarm;

	/** Sets Alarm entities GSI keys */
	configure(): void {
    
	}

}