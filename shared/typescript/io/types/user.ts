import { EntityType, User as UserGraphQlEntity } from "../../types/api";

export enum Inputs {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  CONTINUE = "CONTINUE",
  DISCONTINUE = "DISCONTINUE",
  DELETE = "DELETE",
  GET = "GET"
}

export type Create = {
  id: string,
  name: string,
  email: string,
  created?: string,
  creatorType: string,
  creator: string,
};

export type Get = {
  id: string
};

export type Created = UserGraphQlEntity

export type Discontinue = {
  id: string,
  creator: string,
  creatorType: EntityType.User // | EntityType.Organisation | EntityType.Team
};

export type Continue = Discontinue;