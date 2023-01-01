import { Entity, Model } from "../../../abstracts";
import { IEntityState, IStateableEntity } from "../../../abstracts/interfaces";

export class State implements IEntityState {

  context: Entity & IStateableEntity;
  protected model: Model;

  constructor(context: Entity & IStateableEntity) {
    this.context = context;
    this.model = new Model(context);
  }

  update(): void {

  }

  async graphQlEntity(): Promise<Record<string, any>> {
    return this.context.attributes.collective();
  }

  async discontinue(): Promise<Entity> {
    return this.context;
  }

  async put(): Promise<Entity> {
    return this.context;
  }

  async sync(): Promise<Entity> {
    return this.context;
  }

}