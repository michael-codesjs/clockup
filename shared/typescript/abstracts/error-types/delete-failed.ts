import { ErrorTypes } from "../../types/api";
import { Error } from "../error";

export class DeleteFailed extends Error {
	public name: ErrorTypes = ErrorTypes.DeleteFailed;
	constructor(entity: string) {
		super(`Deletion Failed.`, {
			cause: `Entity(${entity}) either does not exists or can not be deleted by the delete operation initiator.`
		});
	}
}