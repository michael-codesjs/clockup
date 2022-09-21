import Entities from "@entities";
import { EntityType } from "@local-types/api";
import { chance } from "@utilities/constants";
import { AbsoluteUserAttributes } from "framework/entities/types";
import { Authentication } from "../when/authentication";

class GivenUserAttributes {

	private constructor() { }
	static readonly instance = new GivenUserAttributes;

	attributes() {

		const entityType = EntityType.USER;
		const id = chance.guid({ version: 4 });
		const name = chance.name();
		const email = chance.email();

		return { entityType, id, name, email };

	}

	async byId(id: string) {
		const user = await Entities.User({ id }).sync({ exists: false }); // not sure if the user exists
		return user.graphqlEntity();
	}

	instance(attributes?: AbsoluteUserAttributes) {
		// returns a random UserEntityGroup.User instance
		attributes = attributes || this.attributes();
		return Entities.User(attributes);
	}

	async new(attributes: AbsoluteUserAttributes) {
		const instance = await this.instance(attributes).sync({ exists: false });
		return instance.graphqlEntity(); 
	}

	async random() {
		const instance = await this.instance().sync();
		return instance.graphqlEntity();
	}

	async authenticated() {

		const attributes = {
			...this.attributes(),
			password: chance.string({ symbols: true, numeric: true, alpha: true, length: 20 })
		};

		const user = await Authentication.signUp(attributes);
		return this.byId(user.id);

	}

}

export const User = GivenUserAttributes.instance;