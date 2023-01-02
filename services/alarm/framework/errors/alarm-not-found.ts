import { ErrorTypes } from "../../../../shared/typescript/types/api";
import { Error } from "../../../../shared/typescript/abstracts/errors/error";

export class AlarmNotFoundError extends Error {

	public type: ErrorTypes = ErrorTypes.NotFound;

	constructor(id?: string) {
		super("Alarm Not Found", id ? {
			cause: `Alarm with ID ${id} was not found. Alarm was either never created or was deleted.`
		} : undefined);
	}
	
}