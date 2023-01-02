import { ErrorTypes } from "../../../../shared/typescript/types/api";
import { Error } from "../../../../shared/typescript/abstracts/errors/error";

export class InsufficientAttributeToCreateAlarm extends Error {

	public type: ErrorTypes = ErrorTypes.MalfomedInput;

	constructor() {
		super("Insufficient Attributes", {
			cause: `Can not create alarm. Some required attributes are missing.`
		});
	}
	
}