import { Entity } from "../../../shared/typescript/abstracts";
import { IStateableEntity } from "../../../shared/typescript/abstracts/interfaces";
import { User as UserGraphQLEntity } from "../../../shared/typescript/types/api";
import { UserAttributes } from "./attributes";
import { IUser, IUserState } from "./interfaces";
import { UserKeys } from "./keys";
import { Null } from "./states";
import { AbsoluteStateUserConstructorParams, NullStateUserConstructorParams, SemiStateUserConstructorParams } from "./types";

// type aliases
type N = NullStateUserConstructorParams;
type S = SemiStateUserConstructorParams;
type A = AbsoluteStateUserConstructorParams;

/** Low level entity in our entity framzwork */
export class User extends Entity implements IStateableEntity, IUser {

	public attributes: UserAttributes = new UserAttributes();
	public keys = new UserKeys(this);

	state: IUserState = new Null(this);

	constructor(attributes: N | S | A) {
		super();
		this.attributes.parse(attributes);
	}

	/** Returns users GraphQL entity. */
	async graphQlEntity(): Promise<UserGraphQLEntity> {
		return await this.state.graphQlEntity();
	}

	/** Syncs a user with its record in the table. */
	async sync(): Promise<User> {
		return (await this.state.sync()) as unknown as User;
	}

	/** Inserts a users record into the table. */
	async put(): Promise<User> {
		return (await this.state.put()) as unknown as User;
	}

	/** Discontinues a user. */
	async discontinue(): Promise<User> {
		console.log("EA:", this.attributes.collective());
		return await this.state.discontinue();
	}

}