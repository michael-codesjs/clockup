import { ErrorTypes } from "../../types/api";
import { BaseError } from "./utility";

export class Error extends BaseError {

	public type: ErrorTypes = ErrorTypes.InternalError;
	public message: string;
	public cause: string;

	constructor(message: string, options= { cause: "" }) {
    
		super(message);
    
		const { cause } = options;

		this.message = message;
		this.cause = cause;
  
	}

}
