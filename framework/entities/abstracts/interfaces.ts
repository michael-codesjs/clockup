import { AbsoluteUser } from "@local-types/index";
import { AttributeSchema, ICommon, User, Alarm } from "../types/attributes";
import { Attributes } from "./attributes";

export interface IEntity {
  composable(): boolean
};

export interface IPutable {
  putable(): boolean
};

export interface IGraphQlEntity {
  graphQlEntity(): Record<string, any> | null
}

export interface ICreatable {
  creator: AbsoluteUser,
  attributes: Attributes<ICommon & { creator: AttributeSchema<string, true> }>
}

export interface IUser extends IEntity {
  attributes: Attributes<User>
}

export interface IAlarm extends IEntity, ICreatable {
  attributes: Attributes<Alarm>
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