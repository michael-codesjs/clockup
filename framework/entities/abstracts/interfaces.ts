import { Alarm, ICommom, User } from "@local-types/api";
import { AbsoluteUser, NullUser } from "@local-types/index";

export interface IEntity {
  attributes(): ICommom
}

export interface ICreatable {
  Creator: NullUser | AbsoluteUser
}

export interface IUser extends IEntity {
  attributes(): User
}

export interface IAlarm extends IEntity, ICreatable {
  attributes(): Alarm
}