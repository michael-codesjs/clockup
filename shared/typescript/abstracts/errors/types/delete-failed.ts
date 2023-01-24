import { ErrorTypes } from "../../../types/api";
import { Error } from "../error";
import { ValidationError } from "yup";

export class DeleteFailed extends Error {
	public type: ErrorTypes = ErrorTypes.DeleteFailed;
	constructor(entity: string) {
		super(`Failed to delete entity(${entity})`, {
			cause: `Entity(${entity}) either does not exists or can not be deleted by the delete operation initiator.`
		});
	}
}