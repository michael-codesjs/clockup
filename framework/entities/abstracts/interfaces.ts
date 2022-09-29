import { EntityType, ICommom, User } from "@local-types/api";

export interface IEntity {
  attributes(): ICommom
}

export interface IUser extends IEntity {
  attributes(): User
}