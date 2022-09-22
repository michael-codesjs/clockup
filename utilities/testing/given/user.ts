import { ulid } from "ulid";
import Entities from "@entities";
import { EntityType } from "@local-types/api";
import { chance } from "@utilities/constants";
import { AbsoluteUserAttributes } from "framework/entities/types";
import { Authentication } from "../when/authentication";

class GivenUserAttributes {

	private constructor() { }
	static readonly instance = new GivenUserAttributes;

	attributes() {

		const entityType = EntityType.User;
		const id = ulid();
		const name = chance.name();
		const email = chance.email();

		return { entityType, id, name, email };

	}

	async byId(id: string) {
		const instance = await Entities.User({ id }).sync({ exists: false }); // not sure if the user exists thus the exists: false, if we pass true, sync will throw an error
		return instance.graphqlEntity();
	}

	async new(attributes: AbsoluteUserAttributes) {
		const instance = await Entities.User(attributes).sync({ exists: false });
		return instance.graphqlEntity(); 
	}

	async random() {
		const attributes = this.attributes();
		return await this.new(attributes);
	}

	async authenticated() {

		const attributes = {
			...this.attributes(),
			password: chance.string({ symbols: true, numeric: true, alpha: true, length: 20 })
		};

		const { id } = await Authentication.signUp(attributes); // sign up user

		await Authentication.signIn({
			username: attributes.email,
			password: attributes.password
		}); // sign in user

		return this.byId(id);

	}

}

export const User = GivenUserAttributes.instance;