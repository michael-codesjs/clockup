import { EntityType, User as UserGraphQlEntity, UpdateUserInput, OperationResponse, ErrorResponse } from "../../types/api";
import { CommonInput } from "../types/main";

export enum Inputs {
  CREATE = "USER_CREATE",
  CREATED = "USER_CREATED",
  GET = "USER_GET",
  GOT = "USER_GOT",
  UPDATE = "USER_UPDATE",
  CONTINUE = "USER_CONTINUE",
  CONTINUED = "USER_CONTINUED",
  DISCONTINUE = "USER_DISCONTINUE",
  DISCONTINUED = "USER_DISCONTINUED",
  INITIATE_DELETE = "USER_INITIATE_DELETE",
  DELETE = "USER_DELETE",
  CREATABLES_CLEAN_UP = "USER_CREATABLES_CLEAN_UP",
  CREATABLES_CLEANED_UP = "USER_CREATABLES_CLEANED_UP",
  DELETION_SETTLED = "USER_DELETION_SETTLED"
}

export type CREATE = CommonInput<Inputs.CREATE, {
  id: string,
  name: string,
  email: string,
  created?: string,
  creatorType: string,
  creator: string,
}>;

export type CREATED = CommonInput<Inputs.CREATED, UserGraphQlEntity>;

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

export type DISCONTINUE = CommonInput<Inputs.DISCONTINUE, {
  id: string,
  creator: string,
  creatorType: EntityType.User // | EntityType.Organisation | EntityType.Team
}>;

export type DISCONTINUED = CommonInput<Inputs.DISCONTINUED, {
  success: boolean,
  payload: DISCONTINUE["payload"]
}>

export type CONTINUE = CommonInput<Inputs.CONTINUE, DISCONTINUE["payload"]>;
export type CONTINUED = CommonInput<Inputs.CONTINUED, OperationResponse | ErrorResponse>;

export type INITIATE_DELETE = CommonInput<Inputs.INITIATE_DELETE, {
  id: string,
  creator: string,
  creatorType: EntityType.User // | EntityType.Organisation | EntityType.Team
}>;

export type CREATABLES_CLEAN_UP = CommonInput<Inputs.CREATABLES_CLEAN_UP, {
  id: string,
  creator: string,
  creatorType: EntityType.User // | EntityType.Organisation | EntityType.Team
}>;

export type CREATABLES_CLEANED_UP = CommonInput<Inputs.CREATABLES_CLEANED_UP, {
  success: boolean,
  payload: CREATABLES_CLEAN_UP["payload"]
}>;

export type DELETION_SETTLED = CommonInput<Inputs.DELETION_SETTLED, {
  success: boolean,
  payload: INITIATE_DELETE["payload"]
}>;