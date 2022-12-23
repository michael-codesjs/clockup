import { EntityType } from "shared/types/api";
import { Attributes } from "../abstracts";
import { ICommon, User } from "../../../framework/entities/types/attributes";
import { EntriesFromAttributesSchema, ToAttributeParams } from "../../../framework/entities/types/utility";

export class UserAttributes extends Attributes<User> {

	private static readonly config: ToAttributeParams<Omit<User, keyof ICommon>> = {
		name: { initial: null, required: true },
		email: { initial: null, required: true },
		alarms: { initial: 0, required: false }
	};

	constructor() {
		super(UserAttributes.config);
	}

	parse(attributes: Partial<EntriesFromAttributesSchema<User>>): void {
		super.parse({
			...attributes,
			entityType: EntityType.User
		});
	}

	/** attributes also stored in cognito */
	get cognito() {
		return {
			name: this.get("name"),
			email: this.get("email")
		};
	}

}