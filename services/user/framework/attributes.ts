import { EntityType } from "../../../shared/typescript/types/api";
import { Attributes } from "../../../shared/typescript/abstracts";
import { CommonAttributes } from "../../../shared/typescript/abstracts/types";
import { EntriesFromAttributesSchema, ToAttributeParams } from "../../../shared/typescript/abstracts/types/utility";
import { UserAttributesSchemaCollection } from "./types";

export class UserAttributes extends Attributes<UserAttributesSchemaCollection> {

	private static readonly config: ToAttributeParams<Omit<UserAttributesSchemaCollection, keyof CommonAttributes>> = {
		name: { initial: null, required: true },
		email: { initial: null, required: true },
		alarms: { initial: null, required: false }
	};

	constructor() {
		super(UserAttributes.config);
	}

	parse(attributes: Partial<EntriesFromAttributesSchema<UserAttributesSchemaCollection>>): void {
		super.parse({
			alarms: 0,
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