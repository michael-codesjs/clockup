import { EntityType, User as TUser } from "@local-types/api";
import { OmitTypeName } from "@local-types/utility";
import { Attributes } from "../abstracts";
import { ImmutableAttributes } from "../types";

type User = OmitTypeName<TUser>;
type ImmutableUserAttributes = ImmutableAttributes & "alarms";

export class UserAttributes extends Attributes<User> {

	private static readonly config = {
		name: { initial: null, required: true },
		email: { initial: null, required: true },
		alarms: { initial: null, required: false }
	};

	constructor() {
		super(UserAttributes.config);
	}

	parse(attributes: Partial<Omit<User, "entityType" | "__typename">>) {
		super.parse({
			...attributes,
			entityType: EntityType.User,
		});
	}

	set(attributes: Partial<Omit<User, ImmutableUserAttributes>>) {
		super.set(attributes);
	}

	/** attributes also stored in cognito */
	get cognito() {
		return {
			name: this.get("name"),
			email: this.get("email")
		};
	}

}