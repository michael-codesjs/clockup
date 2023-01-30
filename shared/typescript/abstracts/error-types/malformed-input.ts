import { ErrorTypes } from "../../types/api";
import { Error } from "../error";
import { ValidationError } from "yup";

export class MalformedInput extends Error {
	public name: ErrorTypes = ErrorTypes.MalfomedInput;
	constructor(errors:ValidationError["errors"]) {
		super(errors.toString(), {
			cause: "A type in input is not of the desired type."
		});
	}
}