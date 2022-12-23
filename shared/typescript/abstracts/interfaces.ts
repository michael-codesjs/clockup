import { AttributeSchema, CommonAttributes } from "./types";
import { Entity, Attribute, Attributes } from ".";

export interface IEntity {
  composable(): boolean
}

export interface IEntityState {
  sync(): Promise<Entity>,
  put(): Promise<Entity>,
  terminate(): Promise<Entity>,
  discontinue(): Promise<Entity>
  graphQlEntity(): null | Record<string, any>
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

export interface ICreatable {
  attributes: Attributes<CommonAttributes & { creator: AttributeSchema<string, true> }>
}