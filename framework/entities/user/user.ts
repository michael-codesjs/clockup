import { cognitoProvider } from "@lib/cognito";
import * as types from "@local-types/api";
import type { IAbsoluteEntity, IEntityFactory } from "@local-types/interfaces";
import { GraphQlEntity } from "@local-types/utility";
import { configureEnviromentVariables } from "@utilities/functions";
import { Entity, Model } from "../abstracts";
import { IUser } from "../abstracts/interfaces";
import type { AbsoluteUserAttributes, NullUserAttributes } from "../types";
import { UserModel } from "./model";

const { COGNITO_USER_POOL_ID } = configureEnviromentVariables();

namespace UserEntityGroup {

	type MutableUserAttributes = {
		email?: string,
		name?: string
	}

	/**
	 * NULL USER:
	 * A user whose existence and variant is unverified
	 * An intermidiary you use to obtain an absolute user via it's sync method.
	 * @param {NullUserAttributes} properties object containing the id of the absolute user the client wishes to obtain.
	 */

	export class NullUser extends Entity {

		readonly entityType = types.EntityType.User;

		readonly TypeOfSelf = NullUser;
		readonly NullTypeOfSelf = NullUser;
		readonly AbsoluteTypeOfSelf = User;

		protected readonly model = new UserModel(this);

		protected PrimaryAttributes: string[];

		constructor(properties: NullUserAttributes) {
			super(properties, types.EntityType.User);
		}

		protected set_GSI_keys(): void { }

		attributes(): null {
			return null;
		}

		graphQlEntity(): null {
			return null;
		}

		setAttributes(): never {
			throw new Error("Can not set mutable attributes of NullUser.");
		}

		async sync(): Promise<User | never> {
			const { Item } = await this.model.get(); // get user record from db;
			if (!Item) throw new Error(`Could not sync user. Concrete absolute user(${+this.Id}) does not exist`);
			return new User(Item as AbsoluteUserAttributes);
		}

	}

	export class User extends Entity implements IAbsoluteEntity, IUser {

		readonly entityType: types.EntityType = types.EntityType.User;

		readonly TypeOfSelf = User;
		readonly NullTypeOfSelf = NullUser;
		readonly AbsoluteTypeOfSelf = User;

		protected readonly model:Model = new UserModel(this);

		/* ATTRIBUTES */
		// primary
		private Name: string;
		private Email: string;
		// secondary
		private Alarms = 0;

		protected PrimaryAttributes: string[] = ["Email", "Name"];
		protected ImmutableAttributes: string[] = ["Alarms"];

		constructor(attributes: AbsoluteUserAttributes & { created?: string }) {
			super(attributes, types.EntityType.User);
			this.setupAttributes(attributes);
			this.setAttributes(attributes);
		}

		/** Configures self with attributes provided by the client */
		protected setupAttributes(params: ConstructorParameters<typeof User>[0]) {
			const { email, name } = params;
			this.Email = email; // setup attributes
			this.Name = name; // as attributes grow, move attribute setup to a seperate method
		}

		/** Sets the GSI partition keys used by self */
		protected set_GSI_keys() { } // TODO: populate

		attributes() {
			return {
				...super.attributes(), // get id, entityType, created and modified
				email: this.Email,
				name: this.Name,
				alarms: this.Alarms
			};
		}

		setAttributes(attributes: MutableUserAttributes): void {
			super.setAttributes(attributes);
		}

		/**
		 * Use to obtain graphql representation of UserEntityGroup.User
		 * @returns {types.User}
		 */
		graphQlEntity(): GraphQlEntity<types.User> {
			const entity = {
				...super.graphQlEntity(),
				...this.attributes()
			};
			return entity;
		}

		async update(attributes: MutableUserAttributes): Promise<User> {
			this.setAttributes(attributes);
			return await this.sync();
		}

		async put(): Promise<User | never> {
			if (!this.validatePrimaryAttributes()) throw new Error("Insufficient attributes provided for record creation.");
			await this.model.put();
			return this;
		}

		async sync(): Promise<User> {
			await this.updateCognito();
			const { Attributes } = await this.model.mutate();
			this.setAttributes(Attributes);
			return this;
		}

		/** updates user attributes in cognito */
		private async updateCognito() {

			const attributes = [];

			/** populate attributes to contain non null values */
			Object.entries({ email: this.Email, name: this.Name })
				.forEach(([key, value]) => {
					value !== null && value !== undefined && attributes.push({
						Name: key,
						Value: value as string
					});
				});

			const cognitoAdminUpdateParams = {
				UserPoolId: COGNITO_USER_POOL_ID!,
				Username: this.Id,
				UserAttributes: attributes
			};


			return await cognitoProvider()
				.adminUpdateUserAttributes(cognitoAdminUpdateParams) // update user attributes in the cognito user pool
				.promise();
		}

	}

}


/*USER FACTORY */

type Attributes = AbsoluteUserAttributes | NullUserAttributes;
type UserVariant<T> =
	T extends AbsoluteUserAttributes ? UserEntityGroup.User :
	T extends NullUserAttributes ? UserEntityGroup.NullUser : never;

/**
 * Factory used to obtain variants from the UserEntityGroup.
 * @param {Attribtues} params containing attributes that determine which variant from the UserEntityGroup it gets.
 */

class Factory implements IEntityFactory {

	private constructor() { }
	static readonly instance = new Factory();

	createEntity<T extends Attributes>(params: T): UserVariant<T> | never {

		if (params && ("name" in params || "email" in params)) {
			return new UserEntityGroup.User(params) as UserVariant<T>;
		} else if (params && "id" in params) {
			return new UserEntityGroup.NullUser(params) as UserVariant<T>;
		} else {
			throw new Error("Can not instanciate variant of user");
		}

	}

}

export const UserEntityFactory = Factory.instance;