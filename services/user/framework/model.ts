import { Model } from "../../../shared/typescript/abstracts";
import { configureEnviromentVariables } from "../../../shared/typescript/utilities/functions";
import { User } from "./user";

const { USER_TABLE_NAME } = configureEnviromentVariables();

export class UserModel extends Model {

	constructor(entity: User) {
		super(entity, USER_TABLE_NAME);
	}

	updateAttributes() {
		const attributes = super.updateAttributes();
		delete (attributes as any).alarms;
		return attributes;
	}

}