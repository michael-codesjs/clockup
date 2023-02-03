import { EntityType, User as UserGraphQlEntity, UpdateUserInput } from "../../types/api";

export enum Inputs {
  CREATE = "CREATE",
  CREATED = "CREATED",
  GET = "GET",
  GOT = "GOT",
  UPDATE = "UPDATE",
  CONTINUE = "CONTINUE",
  DISCONTINUE = "DISCONTINUE",
  DELETE = "DELETE"
}

export type CREATE = {
  type: Inputs.CREATE,
  correlationId: string,
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
  correlationId: string,
  payload: UserGraphQlEntity
}

export type GET = {
  type: Inputs.GET,
  correlationId: string,
  payload: {
    id: string
  }
};

export type GOT = {
  type: Inputs.GOT,
  correlationId: string,
  payload: UserGraphQlEntity
};

export type UPDATE = {
  type: Inputs.UPDATE,
  correlationId: string,
  payload: UpdateUserInput & { id: string }
};

export type UPDATED = {
  type: Inputs.UPDATE,
  correlationId: string,
  payload: UserGraphQlEntity
}

export type Discontinue = {
  id: string,
  creator: string,
  creatorType: EntityType.User // | EntityType.Organisation | EntityType.Team
};

export type Continue = Discontinue;