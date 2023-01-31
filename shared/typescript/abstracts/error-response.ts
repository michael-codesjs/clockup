import { IGraphQlEntity } from "./interfaces";
import { ErrorResponse as TErrorResponse } from "../types/api";
import { MalformedInput } from "./error-types/malformed-input";
import { Error } from "./error";

export class ErrorResponse implements IGraphQlEntity {

	public readonly error: Error;

	constructor(error: any) {
		error = error instanceof Error ? error : this.getErrorFromGenericError(error);
		this.error = error;
	}

	private getErrorFromGenericError(error: any) {
		if (error && error.name === "ValidationError") {
			return new MalformedInput(error.errors);
		} else {
			return new Error("Something went wrong.");
		}
	}

	graphQlEntity(): TErrorResponse {
		return {
			__typename: "ErrorResponse",
			type: this.error.name,
			message: this.error.message,
			code: this.error.code,
			cause: this.error.cause
		};
	}

}