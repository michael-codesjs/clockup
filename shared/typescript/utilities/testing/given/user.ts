import { ulid } from "ulid";
import { Keys } from "../../../abstracts";
import { dynamoDbOperations } from "../../../lib/dynamoDb";
import { EntityType, User as TUser } from "../../../types/api";
import { chance } from "../../../utilities/constants";
import { configureEnviromentVariables } from "../../../utilities/functions";

const { DYNAMO_DB_TABLE_NAME } = configureEnviromentVariables();
const TableName = DYNAMO_DB_TABLE_NAME!;

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
		const creator = id;
		const creatorType = entityType;
		const discontinued = false;
		const created = chance.date().toJSON();
		const alarms = chance.integer({ min: 0, max: 20 });

		return {
			entityType,
			id,
			creator,
			creatorType,
			created,
			discontinued,
			alarms,
			...this.input(),
		};

	}

	async byId(id: string) {

		const key = Keys.constructKey({
			descriptors: [EntityType.User],
			values: [id]
		}) as any;

		
		const result = await dynamoDbOperations.get({
      TableName,
      Key: {
        PK: key,
        SK: key
      }
    });

    return result.Item as TUser
	
	}

	async new(attributes: TUser = this.attributes()) {

		const key = Keys.constructKey({
			descriptors: [EntityType.User],
			values: [attributes.id]
		}) as any;

		
    const Item = {
      ...attributes,
      PK: key,
      SK: key
    } as any;
    
    await dynamoDbOperations.put({
      TableName,
      Item
    });

    return Item as TUser;
	
  }
	/*

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
		const instance = Entities.User(attributes);
		await instance.put();
		return instance;
	}

	absoluteEntity(input = this.input()) {
		return Entities.User(input);
	}

	async authenticated() {

		const attributes = {
			...this.input(),
			password: chance.string({ symbols: true, numeric: true, alpha: true, length: 20 })
		};

		const { id } = await Authentication.signUp(attributes); // sign up user

		await Authentication.signIn({
			username: attributes.email,
			password: attributes.password
		}); // sign in user

		return {
			...attributes,
			id,
			alarms: 0
		};

	}

	async authenticatedInstance() {
		const attributes = await this.authenticated();
		return UserFactory.createEntity(attributes);
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
	*/

}

export const User = GivenUserAttributes.instance;