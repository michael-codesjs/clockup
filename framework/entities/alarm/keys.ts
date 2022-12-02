import { Entity, Keys } from "../abstracts";
import { IAlarm } from "../abstracts/interfaces";

export class AlarmKeys extends Keys {

	public Entity: Entity & IAlarm;

	/** sets alarm entities GSI keys */
	configure(): void {
    
	}

}