import { Model } from "../abstracts";


export class UserModel extends Model {

	updateAttributes() {
		const attributes = super.updateAttributes();
		delete (attributes as any).alarms;
		return attributes;
	}

}