import { EntityErrorMessages } from "../../types";
import { Error } from "../error";

export class InvalidAttributeAttribute extends Error {
	constructor(attribute?: string) {
		super(EntityErrorMessages.ATTEMPT_TO_MUTATE_IMMUTABLE, attribute ? {
			cause: `Invalid value was supplied. Value ${attribute} is not assignable to attribute`
		} : undefined);
	}
}