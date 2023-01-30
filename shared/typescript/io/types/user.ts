import { EntityType, User as UserGraphQlEntity } from "../../types/api";

export enum Inputs {
  CREATE = "CREATE",
  CREATED = "CREATED",
  UPDATE = "UPDATE",
  CONTINUE = "CONTINUE",
  DISCONTINUE = "DISCONTINUE",
  DELETE = "DELETE",
  GET = "GET"
}

export type CREATE = {
  type: Inputs.CREATE,
  cid: string,
  payload: {
    id: string,
    name: string,
    email: string,
    created?: string,
    creatorType: string,
    creator: string,
  }
};

export type CREATED = {
  type: Inputs.CREATED,
  cid: string,
  payload: UserGraphQlEntity
}

export type Get = {
  id: string
};

export type Discontinue = {
  id: string,
  creator: string,
  creatorType: EntityType.User // | EntityType.Organisation | EntityType.Team
};

export type Continue = Discontinue;