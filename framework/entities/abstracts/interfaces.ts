import { Alarm, User } from "@local-types/api";
import { AbsoluteUser } from "@local-types/index";
import { Attributes } from "./attributes";

export interface IEntity {
  composable(): boolean
}


export interface IGraphQlEntity {
  graphQlEntity(): Record<string, any> | null
}

export interface ICreatable {
  creator: AbsoluteUser,
  attributes: Attributes<{ creator: string}>
}

export interface IUser extends IEntity {
  attributes: Attributes<User>
}

export interface IAlarm extends IEntity, ICreatable {
  attributes: Attributes<Alarm>
}

export interface IPutable {
  putable(): boolean
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