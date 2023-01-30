import { ErrorTypes } from "../types/api";
import { BaseError } from "./utility";

type Params = {
	cause: string,
	code?: number
};

export class Error extends BaseError {

	public name: ErrorTypes = ErrorTypes.InternalError;
	public message: string;
	public cause: string;
	public code: number = 500;
	public stack = undefined;

	constructor(message: string, options: Params = { cause: "" }) {
		super(message);
		const { cause } = options;
		this.cause = cause;
	}

}
