import { Alarm } from "./";
import { ISubscriber } from "../../../shared/typescript/abstracts/interfaces";
import { Alarm as AlarmGraphQLEntity } from "../../../shared/typescript/types/api";
import { InsufficientAttributeToCreateAlarm } from "./errors/insufficient-attributes-to-create-alarm";
import { AlarmNotFoundError } from "./errors/alarm-not-found";
import { IAlarm, IAlarmState } from "./interfaces";
import { AlarmModel } from "./model";

/** State an entity is in when the only thing it knows about itself is it's ID */
export class Null implements IAlarmState, ISubscriber {

  context: Alarm;
  protected model: AlarmModel;

  constructor(context: Alarm) {
    this.context = context;
    this.model = new AlarmModel(context);
    this.context.attributes.subscribe(this);
  }

  update(): void { // is called when the context's attributes are mutated.
    if (this.context.attributes.isPutable()) { // set to absolute state.
      this.context.state = new Absolute(this.context);
    } else if (this.context.attributes.isUpdateable()) { // set to semi state.
      this.context.state = new Semi(this.context);
    }
  }

  async sync(): Promise<Alarm> {
    const { Item } = await this.model.get(); // get user record from table
    if (!Item) throw new AlarmNotFoundError(this.context.attributes.get("id"));
    else this.context.attributes.parse(Item);
    return this.context;
  }

  async put(): Promise<Alarm> {
    throw new InsufficientAttributeToCreateAlarm();
  }

  async graphQlEntity(): Promise<AlarmGraphQLEntity> {
    await this.sync(); // user is in null state, sync to fetch user attributes and put user in absolute.
    return await this.context.state.graphQlEntity(); // call the absolute states implementation of graphQlEntity method.
  }

  async discontinue(): Promise<Alarm> {

    this.context.attributes.parse({
      ...this.context.attributes.valid(),
      discontinued: true
    });

    await this.model.discontinue();

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

  async sync(): Promise<Alarm> {

    try {

      const { Attributes } = await this.model.update(); // update user details and obtain rest of attributes, some of which we already have
      this.context.attributes.parse(Attributes);
      return this.context;

    } catch (error: any) {

      if (error.message === "The conditional request failed") throw new AlarmNotFoundError(); // user was never created or is discontinued
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

  async put(): Promise<Alarm> {
    await this.model.put();
    return this.context;
  }

  async graphQlEntity(): Promise<AlarmGraphQLEntity> {
    return {
      __typename: "User",
      ...this.context.attributes.collective()
    }
  };

}