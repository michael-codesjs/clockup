import { Entity, Model } from "..";
import { IEntityState, ISubscriber } from "../interfaces";
import { EntityErrorMessages } from "../types";
import { Absolute, Semi } from ".";

/** State an entity is in when the only thing it knows about itself is it's ID */
export class Null implements IEntityState, ISubscriber {

  protected context: Entity;
  protected model: Model;

  constructor(context: Entity) {
    context.attributes.subscribe(this);
    this.context = context;
    this.model = new Model(context);
  }

  update(): void {
    if (this.context.attributes.isPutable()) {
      this.context.setState(Absolute);
    } else if (this.context.attributes.isUpdateable()) {
      console.log("isUpdateable")
      this.context.setState(Semi);
    }
  }

  async sync(): Promise<Entity> {
    const { Item } = await this.model.get(); // get entity record from db
    if (!Item) throw new Error(EntityErrorMessages.CREATABLE_BY_CREATOR_NOT_FOUND);
    this.context.attributes.parse(Item);
    return this.context;
  }

  graphQlEntity(): null | Record<string, any> {
    return null;
  }

  async put(): Promise<Entity> {
    throw new Error(EntityErrorMessages.INSUFFICIENT_ATTRIBUTES_TO_PUT);
  }

  async terminate(): Promise<Entity> {
    await this.model.delete();
    return this.context;
  }

  async discontinue(): Promise<Entity> {

    this.context.attributes.parse({
      ...this.context.attributes.valid(),
      discontinued: true
    });

    await this.model.discontinue();

    return this.context;

  }

}