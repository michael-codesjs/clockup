import { Entity, Model } from "../abstracts";

export class UserModel extends Model {

	constructor(entity: Entity) {
		super(entity);
	}

	entityUpdateItemAttributes(): Record<string, any> {
		const attributes = super.entityUpdateItemAttributes();
		delete attributes.alarms; // you can not override the alarm count
		return attributes;
	}

}