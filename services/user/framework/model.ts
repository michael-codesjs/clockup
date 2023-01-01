import { Model } from "../../../shared/typescript/abstracts";

export class UserModel extends Model {

	updateAttributes() {
		const attributes = super.updateAttributes();
		delete (attributes as any).alarms;
		return attributes;
	}

}