import { ErrorResponse as TErrorResponse, ErrorTypes } from "@local-types/api";
import { IGraphQlEntity } from "../abstracts/interfaces";
import { Error } from "./error";

export class ErrorResponse implements IGraphQlEntity {

	private error: Error;

	constructor(error: Error) {
		this.error = error;
	}

	graphQlEntity(): TErrorResponse {
		return {
			__typename: "ErrorResponse",
			type: this.error.type,
			message: this.error.name
		};
	}

}