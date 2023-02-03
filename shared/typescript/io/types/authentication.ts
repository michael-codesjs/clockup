import { ErrorResponse, OperationResponse } from "../../types/api";
import { CommonInput } from "./main"

export enum Inputs {
  UPDATE = "COGNITO_USER_UPDATE",
  UPDATED = "COGNITO_USER_UPDATED",
  DELETE = "COGNITO_USER_DELETE",
  DELETED = "COGNITO_USER_DELETED"
}

/** authentication service 'UPDATE' input structure. */
export type UPDATE = CommonInput<Inputs.UPDATE, {
  id: string,
  email?: string,
  name?: string
}>;

/** authentication service 'UPDATED' input structure. */
export type UPDATED = CommonInput<Inputs.UPDATED, OperationResponse | ErrorResponse>;

export type DELETE = CommonInput<Inputs.DELETE, {
  id: string
}>;

export type DELETED = CommonInput<Inputs.DELETED, OperationResponse | ErrorResponse>