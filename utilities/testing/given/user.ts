import { ulid } from "ulid";
import Entities from "@entities";
import { EntityType, User as TUser } from "@local-types/api";
import { chance } from "@utilities/constants";
import { Authentication } from "../when/authentication";
import { cognitoProvider } from "@lib/cognito";
import { configureEnviromentVariables } from "@utilities/functions";
import { CognitoIdentityServiceProvider } from "aws-sdk";
import { UserConstructorParams } from "framework/entities/types/constructor-params";

const { COGNITO_USER_POOL_ID } = configureEnviromentVariables();

class GivenUserAttributes {

	private constructor() { }
	static readonly instance = new GivenUserAttributes;

	input() {
		
		const name = chance.name();
		const email = chance.email();
		
		return { name, email };

	}

	attributes(): TUser {

		const entityType = EntityType.User;
		const id = ulid();
		const discontinued = false;
		const created = chance.date().toJSON();
		const alarms = chance.integer({ min: 0, max: 20 });

		return { entityType, id, ...this.input(), created, discontinued, alarms };

	}

	async byId(id: string) {
		try {
			const instance = await Entities.User({ id }).sync(); // not sure if the user exists thus the exists: false, if we pass true, sync will throw an error
			return instance.graphQlEntity();
		} catch(error) {
			return null;
		}
	}

	async new(attributes: UserConstructorParams) {
		const instance = await Entities.User(attributes).put();
		return instance.graphQlEntity();
	}

	async random() {
		const attributes = this.input();
		return await this.new(attributes);
	}

	async instance(attributes?: UserConstructorParams) {
		attributes = attributes || this.input();
		const instance = await Entities.User(attributes).sync();
		return instance;
	}

	absoluteEntity(attributes = this.attributes()) {
		return Entities.User(attributes);
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

	async fromPool(id: string) {

		const cognitoResponse = await cognitoProvider()
			.adminGetUser({
				Username: id,
				UserPoolId: COGNITO_USER_POOL_ID!
			})
			.promise();

		const parsedAttributes = this.parseCognitoUserAttributes(cognitoResponse.UserAttributes);

		return parsedAttributes;

	}

	private parseCognitoUserAttributes(attributes: CognitoIdentityServiceProvider.AdminGetUserResponse["UserAttributes"]): Record<string, any> {
		return attributes.reduce((collective, attribute) => {
			collective[attribute.Name] = attribute.Value;
			return collective;
		}, {});
	}

}

export const User = GivenUserAttributes.instance;