import { cognitoProvider } from "@lib/cognito";
import * as types from "shared/types/api";
import type { IEntityFactory } from "shared/types/interfaces";
import { configureEnviromentVariables } from "@utilities/functions";
import { Attributes, Entity, Keys } from "../abstracts";
import { IUser } from "../abstracts/interfaces";
import { UserNotFoundError } from "../../../shared/errors/user-not-found";
import { EntityErrorMessages } from "../types";
import { NullUserConstructorParams, UserConstructorParams } from "../types/constructor-params";
import { UserAttributes } from "./attributes";
import { UserKeys } from "./keys";
import { UserModel } from "./model";

const { COGNITO_USER_POOL_ID } = configureEnviromentVariables();

namespace UserEntityGroup {

	/**
	 * NULL USER:
	 * A user whose existence and variant is unverified
	 * An intermidiary you use to obtain an absolute user via it's sync method.
	 * @param {NullUserAttributes} properties object containing the id of the absolute user the client wishes to obtain.
	 */

	export class NullUser extends Entity {

		readonly entityType = types.EntityType.User;

		readonly TypeOfSelf: typeof NullUser = NullUser;
		readonly NullTypeOfSelf: typeof NullUser = NullUser;
		readonly AbsoluteTypeOfSelf: typeof User = User;

		public readonly attributes = new Attributes();
		public readonly keys = new Keys(this);

		constructor(properties: NullUserConstructorParams) {
			super();
			this.attributes.parse({ ...properties, entityType: types.EntityType.User });
		}

		graphQlEntity(): null {
			return null;
		}

		async sync(): Promise<User | never> {
			const { Item } = await this.model.get(); // get user record from db
			if (!Item) throw new UserNotFoundError(this.attributes.get("id"));
			return new User(Item as UserConstructorParams);
		}

		async discontinueCognito() {

			await cognitoProvider()
				.adminDisableUser({
					Username: this.attributes.get("id"),
					UserPoolId: COGNITO_USER_POOL_ID!
				})
				.promise();
		}

	}

	export class User extends Entity implements IUser {

		readonly TypeOfSelf: typeof User = User;
		readonly NullTypeOfSelf: typeof NullUser = NullUser;
		readonly AbsoluteTypeOfSelf: typeof User = User;

		protected readonly model: UserModel = new UserModel(this);
		public attributes: UserAttributes = new UserAttributes();
		public keys = new UserKeys(this);

		constructor(attributes: UserConstructorParams) {
			super();
			this.attributes.parse(attributes);
		}

		/**
		 * Use to obtain graphql representation of UserEntityGroup.User
		 * @returns {types.User}
		 */
		graphQlEntity(): types.User {
			return {
				__typename: "User",
				...this.attributes.collective()
			};
		}

		async sync(): Promise<User> {
			const { Attributes } = await this.model.update();
			this.attributes.parse(Attributes);
			return this;
		}

		/** updates user attributes in cognito */
		public async syncCognito() {

			const attributes = [];

			// populate attributes to contain non null values
			Object.entries(this.attributes.cognito)
				.forEach(([key, value]) => {
					value !== null && value !== undefined && attributes.push({
						Name: key,
						Value: value as string
					});
				});

			const cognitoAdminUpdateParams = {
				UserPoolId: COGNITO_USER_POOL_ID!,
				Username: this.attributes.get("id"),
				UserAttributes: attributes
			};

			await cognitoProvider()
				.adminUpdateUserAttributes(cognitoAdminUpdateParams) // update user attributes in the cognito user pool
				.promise();

		}

	}

}

/* USER FACTORY */

type UserFactoryParams = UserConstructorParams | NullUserConstructorParams;
type UserVariant<T> = (
	T extends UserConstructorParams ? UserEntityGroup.User :
	T extends NullUserConstructorParams ? UserEntityGroup.NullUser : never
);

/**
 * Factory used to obtain variants from the UserEntityGroup.
 * @param {Attribtues} params containing attributes that determine which variant from the UserEntityGroup it gets.
 */

class UserFactoryBlueprint implements IEntityFactory {

	private constructor() { }
	static readonly instance = new UserFactoryBlueprint();

	createEntity<T extends UserFactoryParams>(params: T): UserVariant<T> {
		if (params && ("name" in params || "email" in params)) {
			return new UserEntityGroup.User(params) as UserVariant<T>;
		} else if (params && "id" in params) {
			return new UserEntityGroup.NullUser(params) as UserVariant<T>;
		} else {
			throw new Error(EntityErrorMessages.USER_VARIANT_NOT_FOUND);
		}
	}

}

export const UserFactory = UserFactoryBlueprint.instance;