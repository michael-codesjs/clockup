import type { IEntityFactory } from "@local-types/interfaces";
import * as types from "@local-types/api";
import { Entity } from "../abstracts";
import type { AbsoluteUserAttributes, NullUserAttributes, SyncOptions } from "../types";
import { IUser } from "../abstracts/interfaces";
import { GraphQlEntity } from "@local-types/utility";
import { UpdateItemOutput } from "aws-sdk/clients/dynamodb";
import { configureEnviromentVariables } from "@utilities/functions";
import { cognitoProvider } from "@lib/cognito";

const { COGNITO_USER_POOL_ID } = configureEnviromentVariables();

namespace UserEntityGroup {

	type MutableUserAttributes = {
		email?: string,
		name?: string
	}

	/**
	 * A variant from the UserEntityGroup we absolutely know exists or have enough data to create one.
	 * @constructor
	 * @param {AbsoluteUserAttributes} attribute object with the users email, name and id.
	 */

	export class User extends Entity implements IUser {

		readonly entityType: types.EntityType = types.EntityType.User;

		readonly TypeOfSelf = User;
		readonly NullTypeOfSelf = NullUser;
		readonly AbsoluteTypeOfSelf = User;

		/* ATTRIBUTES */
		/** Email address of the user, also acts as their username in cognito */
		private Email: string;
		/** Name of the user */
		private Name: string;

		constructor(attributes: AbsoluteUserAttributes & { created?: string }) {
			super(attributes, types.EntityType.User);
			this.setupAttributes(attributes);
			this.set_GSI_keys();
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
				name: this.Name
			};
		}

		setAttributes(attributes: MutableUserAttributes): void {
			// only overriding so we i can get that nice intellisense in vscode
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

		async sync(options: SyncOptions = { exists: true }) {

			const { exists } = options;
			let attributes: UpdateItemOutput;

			if (exists) {
				// update cognito details first
				await this.updateCognito();
				attributes = await this.model.mutate();
			} else {
				attributes = await this.model.put();
			}

			this.setAttributes(attributes as MutableUserAttributes);

			return this;

		}

		/**
		 * update user attributes in cognito
		 */
		private async updateCognito() {

			const cognitoAdminUpdateParams = {
				UserPoolId: COGNITO_USER_POOL_ID!,
				Username: this.Id,
				UserAttributes: Object.entries({ email: this.Email, name: this.Name }).map(([key, value]) => {
					return {
						Name: key,
						Value: value as string
					};
				})
			};


			return await cognitoProvider()
				.adminUpdateUserAttributes(cognitoAdminUpdateParams) // update user attributes in the cognito user pool
				.promise();
		}

	}

	/**
	 * NULL USER:
	 * A user whose existence and variant is unverified
	 * A pseudo user you can use to obtain concrete absolute users using the sync method
	 * Simply provide the concrete absolute users id
	 */

	export class NullUser extends Entity {

		readonly entityType = types.EntityType.User;

		readonly TypeOfSelf = NullUser;
		readonly NullTypeOfSelf = NullUser;
		readonly AbsoluteTypeOfSelf = User;

		constructor(properties: NullUserAttributes) {
			super(properties, types.EntityType.User);
		}

		protected set_GSI_keys(): void { }

		attributes(): null {
			return null;
		}

		graphqlEntity(): null {
			return null;
		}

		setAttributes(): never {
			throw new Error("Can not set mutable attributes of NullUser.");
		}

		async sync(): Promise<User | never> {
			const { Item } = await this.model.get(); // get user record from db;
			if(!Item) throw new Error(`Could not sync user. Concrete absolute user(${+this.Id}) does not exist`);
			const user = new User(Item as AbsoluteUserAttributes);
			user.setAttributes(Item as MutableUserAttributes);
			return user;
		}

	}

}


/* USER FACTORY */

type Attributes = AbsoluteUserAttributes | NullUserAttributes;
type UserVariant<T> =
	T extends AbsoluteUserAttributes ? UserEntityGroup.User :
	T extends NullUserAttributes ? UserEntityGroup.NullUser : never;

class Factory implements IEntityFactory {

	private constructor() { }
	static readonly instance = new Factory();

	createEntity<T extends Attributes>(params: T): UserVariant<T> | never {

		if (params && "name" in params && "email" in params) {
			return new UserEntityGroup.User(params as AbsoluteUserAttributes) as UserVariant<T>;
		} else if (params && "id" in params) {
			return new UserEntityGroup.NullUser(params) as UserVariant<T>;
		} else {
			throw new Error("Can not instanciate variant of user");
		}

	}

}

export const UserEntityFactory = Factory.instance;