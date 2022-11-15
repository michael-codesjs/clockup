import { Alarm, ICommon, User } from "@local-types/api";
import { AbsoluteUser, NullUser } from "@local-types/index";
import { Attributes } from "./attributes";

export interface IEntity {

}


export interface IGraphQlEntity {
  graphQlEntity(): Record<string, any> | null
}

export interface ICreatable {
  creator: AbsoluteUser
}

export interface IUser extends IEntity {
  attributes: Attributes<User>
}

export interface IAlarm extends IEntity, ICreatable {
  attributes(): Alarm
}

export interface IPutable {
  putable(): boolean
}

export interface IPublisher {
  subscribers: Array<ISubscriber>
  subscribe(subscriber: ISubscriber): void
  unsubscribe(subscriber: ISubscriber): void
  publish(): void
};

export interface ISubscriber {
  update(): void;
}