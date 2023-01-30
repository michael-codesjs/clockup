import { Error } from "../error";

export class InvalidAttribute extends Error {
	constructor(attribute?: string) {
		super("Invalid attribute value.", attribute ? {
			cause: `Value ${attribute} is not assignable to attribute`
		} : undefined);
	}
}