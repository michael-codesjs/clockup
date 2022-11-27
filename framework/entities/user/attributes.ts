import { Attributes } from "../abstracts";
import { ICommon, User } from "../types/attributes";
import { ToAttributeParams } from "../types/utility";

export class UserAttributes extends Attributes<User> {

	private static readonly config: ToAttributeParams<Omit<User, keyof ICommon>> = {
		name: { initial: null, required: true },
		email: { initial: null, required: true },
		alarms: { initial: null, required: false }
	};

	constructor() {
		super(UserAttributes.config);
	}

	/** attributes also stored in cognito */
	get cognito() {
		return {
			name: this.get("name"),
			email: this.get("email")
		};
	}

}