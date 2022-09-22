import type { IEntityFactory } from "@local-types/interfaces";
import * as types from "@local-types/api";
import { Entity } from "../abstracts";
import type { AbsoluteUserAttributes, NullUserAttributes, SyncOptions } from "../types";
import { NullUserModel, UserModel } from "./model";
import { IUser } from "../abstracts/interfaces";
import { GraphQlEntity } from "@local-types/utility";

namespace UserEntityGroup {

	type UserMutableAttributes = {
		email?: string,
		name?: string
	}

	/**
	 * Absolute User:
	 * A variant of the UserEntityGroup we absolutely know exists or have enough data to create one
	 * Instanciate by:
	 * 1. Providing an id, email and name to the UserEntityGroup factory
	 * 2. A successful NullUser sync
	 */

	export class User extends Entity implements IUser {

		readonly entityType: types.EntityType = types.EntityType.USER;

		readonly TypeOfSelf = User;
		readonly NullTypeOfSelf = NullUser;
		readonly AbsoluteTypeOfSelf = User;

		/* ATTRIBUTES */
		private Email: string;
		private Name: string;

		protected readonly model = new UserModel(this);

		constructor(attributes: AbsoluteUserAttributes & { created?: string }) {

			const { id, created, name, email } = attributes;

			super({ id, created }, types.EntityType.USER);

			this.Email = email; // setup attributes
			this.Name = name; // as attributes grow, move attribute setup to a seperate method

		}

		absolutify(): User {
			return this;
		}

		nullify(): NullUser {
			return new this.NullTypeOfSelf({ id: this.Id });
		}

		attributes() {
			return {
				id: this.Id,
				created: this.Created,
				email: this.Email,
				name: this.Name
			};
		}

		mutableAttributes() {
			return {
				email: this.Email,
				name: this.Name
			};
		}

		setAttributes(attributes: UserMutableAttributes) {
			Object.entries(attributes).forEach(
				([key, value]) => {
					key = key[0].toUpperCase() + key.slice(1);
					if (key in this) { // check if the property exists, typescript should warn you but an extra check for users that love casting ain't gonna hurt
						this["_" + key] = value;
					}
				}
			);
		}

		async sync(options: SyncOptions = { exists: true }) {

			const { exists } = options;
			const attributes = exists ? await this.model.mutate() : await this.model.put(); // update/create the entity in the db table depending on whether they exist or not

			Object.entries(attributes).forEach(([attribute, value]) => {
				// update entity with updated values;
				this[attribute] = value;
			});

			return this;

		}

		async unsync() {
			await this.model.delete();
			return new this.NullTypeOfSelf({ id: this.id });
		}

		graphqlEntity(): GraphQlEntity<types.User> {

			const entity = {
				...super.graphqlEntity(),
				...this.attributes()
			};

			return entity;

		}

	}

	/**
	 * NULL USER:
	 * A user whose existence and variant is unverified
	 * A pseudo user you can use to obtain concrete absolute users using the sync method
	 * Simply provide the concrete absolute users id
	 */

	export class NullUser extends Entity {

		readonly entityType = types.EntityType.USER;

		readonly TypeOfSelf = NullUser;
		readonly NullTypeOfSelf = NullUser;
		readonly AbsoluteTypeOfSelf = User;

		protected readonly model = new NullUserModel(this);

		constructor(properties: NullUserAttributes) {
			super(properties, types.EntityType.USER);
		}

		attributes() { }

		
		mutableAttributes() {}

		graphqlEntity(): null {
			return null;
		}

		setAttributes(): never {
			throw new Error("Can not set mutable attributes of NullUser.");
		}

		async sync(params?:SyncOptions): Promise<User | NullUser | never> {

			const { Item } = await this.model.get(); // get user from db;

			const { exists } = params || {};

			if (Item) return new User(Item);
			else if(exists) throw new Error(`Could not sync user. Concrete absolute user(${+this.Id}) does not exist`); // if you pass exists as true, you are absolutely sure the user exists and want an error when we do not find one
			else return this;

		}

		async unsync() {
			await this.model.delete();
			return this;
		}

	}

}


/* USER FACTORY */

type Attributes = AbsoluteUserAttributes | NullUserAttributes;
type UserVariant<T> = T extends AbsoluteUserAttributes ? UserEntityGroup.User : T extends NullUserAttributes ? UserEntityGroup.NullUser : never;

class Factory implements IEntityFactory {

	private constructor() { }
	static readonly instance = new Factory();

	createEntity<T extends Attributes>(args: T): UserVariant<T> | never {

		if (args && "name" in args && "email" in args) {
			return new UserEntityGroup.User(args) as UserVariant<T>;
		} else if (args && "id" in args) {
			return new UserEntityGroup.NullUser(args) as UserVariant<T>;
		} else {
			throw new Error("Can not instanciate variant of user");
		}

	}

}

export const UserFactory = Factory.instance;