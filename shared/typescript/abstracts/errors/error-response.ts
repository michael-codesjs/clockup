import { IGraphQlEntity } from "../interfaces";
import { ErrorResponse as TErrorResponse } from "../../types/api";
import { MalformedInput } from "./types/malformed-input";
import { Error } from "./error";

export class ErrorResponse implements IGraphQlEntity {

	private error: Error;

	constructor(error: any) {
		error = error instanceof Error ? error : this.getErrorFromGenericError(error);
		this.error = error;
	}

	private getErrorFromGenericError(error: any) {
		if (error.name === "ValidationError") {
			return new MalformedInput(error.errors);
		} else {
			return new Error("Something went wrong.");
		}
	}

	graphQlEntity(): TErrorResponse {
		return {
			__typename: "ErrorResponse",
			type: this.error.type,
			message: this.error.message
		};
	}

}