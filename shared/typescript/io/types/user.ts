import { EntityType, User as UserGraphQlEntity } from "../../types/api";

export enum Inputs {
  CREATE = "CREATE",
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
}

export type Created = UserGraphQlEntity

export type Delete = {
  time: Date,
  type: Inputs.DELETE,
  payload: {
    id: string,
    creator: string,
    creatorType: EntityType.User // | EntityType.Organisation | EntityType.Team
  }
};

export type Get = {
  time: Date,
  type: Inputs.GET,
  payload: {
    id: string
  }
};