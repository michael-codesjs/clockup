import { ErrorTypes } from "../../../../shared/typescript/types/api";
import { Error } from "./../../../../shared/typescript/abstracts/errors/error";

export class InsufficientAttributeToCreateUser extends Error {

	public type: ErrorTypes = ErrorTypes.MalfomedInput;

	constructor() {
		super("Insufficient Attributes", {
			cause: `Can not create user. Some required attributes are missing.`
		});
	}
	
}