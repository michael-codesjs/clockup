import { ErrorTypes } from "../../../../shared/typescript/types/api";
import { Error } from "../../../../shared/typescript/abstracts/error";

export class UserNotFoundError extends Error {

	public type: ErrorTypes = ErrorTypes.NotFound;

	constructor(id?: string) {
		super("User Not Found", id ? {
			cause: `User with ID ${id} was not found. This could either be the user was deleted or was never created.`
		} : undefined);
	}
	
}