import { Attribute, Entity } from ".";

export interface IEntity {
  composable(): boolean
}

export interface IStateableEntity {
  state: IEntityState
};

export interface IEntityState {
  context: Entity & IStateableEntity,
  sync(): Promise<Entity>,
  put(): Promise<Entity>,
  discontinue(): Promise<Entity>,
  continue(): Promise<Entity>,
  graphQlEntity(): Promise<Record<string, any>>
}

export interface IPutable {
  putable(): any,
  isPutable(): boolean
}

export interface IUpdateable {
  updateable(): any,
  isUpdateable(date: Date): boolean,
  modified?: Date | Attribute<Date, boolean>
}

export interface IPublisher {
  subscribers: Array<ISubscriber>
  subscribe(subscriber: ISubscriber): void
  unsubscribe(subscriber: ISubscriber): void
  publish(): void
}

export interface ISubscriber {
  update(): void;
}

export interface IGraphQlEntity {
  graphQlEntity(): Record<string, any> | null
}