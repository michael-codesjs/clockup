import { EntityErrorMessages } from "../types";
import { Error } from "./error";

export class UserNotFoundError extends Error {
  constructor(id?: string) {
    super(EntityErrorMessages.USER_NOT_FOUND, id ? {
      cause: `User with ID ${id} was not found`
    } : undefined)
  }
}