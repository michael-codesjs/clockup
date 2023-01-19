import { Attributes } from "../../../shared/typescript/abstracts";
import { IEntityState } from "../../../shared/typescript/abstracts/interfaces";
import { User as UserGraphQLEntity } from "../../../shared/typescript/types/api";
import { UserAttributesSchemaCollection } from "./types";
import { User } from "./user";

export interface IUserState extends IEntityState {
  context: User,
  sync(): Promise<User>,
  put(): Promise<User>,
  discontinue(): Promise<User>,
  continue(): Promise<User>,
  graphQlEntity(): Promise<UserGraphQLEntity>
}

export interface IUser {
  attributes: Attributes<UserAttributesSchemaCollection>,
  sync(): Promise<User>,
  graphQlEntity(): Promise<UserGraphQLEntity>
}