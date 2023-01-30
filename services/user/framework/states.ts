import { User } from "./";
import { ISubscriber } from "../../../shared/typescript/abstracts/interfaces";
import { User as UserGraphQLEntity } from "../../../shared/typescript/types/api";
import { InsufficientAttributeToCreateUser } from "./errors/insufficient-attributes-to-create-user";
import { UserNotFoundError } from "./errors/user-not-found";
import { IUserState } from "./interfaces";
import { UserModel } from "./model";
import { UserDynamoDbItem } from "./types";

/** State a user entity is in when the only thing it knows about itself is it's ID */
export class Null implements IUserState, ISubscriber {

  context: User;
  protected model: UserModel;

  constructor(context: User) {
    this.context = context;
    this.model = new UserModel(context);
    this.context.attributes.subscribe(this);
  }

  update(): void { // is called when the context's attributes are mutated.
    if (this.context.attributes.isPutable()) { // set to absolute state.
      this.context.state = new Absolute(this.context);
    } else if (this.context.attributes.isUpdateable()) { // set to semi state.
      this.context.state = new Semi(this.context);
    }
  }

  async sync(): Promise<User> {
    const item = await this.model.get<UserDynamoDbItem>(); // get user record from table
    if (!item) throw new UserNotFoundError(this.context.attributes.get("id"));
    else this.context.attributes.parse(item as Omit<typeof item, "entityType">);
    return this.context;
  }

  async put(): Promise<User> {
    throw new InsufficientAttributeToCreateUser();
  }

  async graphQlEntity(): Promise<UserGraphQLEntity> {
    await this.sync(); // user is in null state, sync to fetch user attributes and put user in absolute.
    return await this.context.state.graphQlEntity(); // call the absolute states implementation of graphQlEntity method.
  }

  async discontinue(): Promise<User> {

    this.context.attributes.parse({
      ...this.context.attributes.valid(),
      discontinued: true
    });

    await this.model.discontinue();

    return this.context;

  }

  async continue(): Promise<User> {
    
    this.context.attributes.parse({
      ...this.context.attributes.valid(),
      discontinued: false
    });

    await this.model.continue();

    return this.context;

  }

}

/** State a user is in when it knows it's id and some attributes of itself but not all required. */
export class Semi extends Null {

  update(): void {
    if (this.context.attributes.isPutable()) {
      this.context.state = new Absolute(this.context);
    }
    if (!this.context.attributes.isUpdateable()) {
      this.context.state = new Null(this.context);
    }
  }

  async sync(): Promise<User> {

    try {

      const item = await this.model.update<UserDynamoDbItem>(); // update user details and obtain rest of attributes, some of which we already have
      this.context.attributes.parse(item as Omit<typeof item, "entityType">);
      return this.context;

    } catch (error: any) {

      if (error.message === "The conditional request failed") throw new UserNotFoundError(); // user was never created or is discontinued
      else throw error; // rethrow error

    }

  }

}


/** State a user is in when it knows everything it can know about itself. */
export class Absolute extends Semi {

  update(): void {
    if (!this.context.attributes.isPutable()) {
      if (this.context.attributes.isUpdateable()) this.context.state = new Semi(this.context);
      else this.context.state = new Null(this.context);
    }
  }

  async put(): Promise<User> {
    await this.model.put();
    return this.context;
  }

  async graphQlEntity(): Promise<UserGraphQLEntity> {
    return {
      __typename: "User",
      ...this.context.attributes.collective()
    }
  };

}