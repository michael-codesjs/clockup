import { EntityErrorMessages } from "../types/index";
import { Error } from "../error";

export class MutateImmutable extends Error {
	constructor(attribute?: string, collection?:string) {
		super(EntityErrorMessages.ATTEMPT_TO_MUTATE_IMMUTABLE, attribute ? {
			cause: `Attempting to mutate immutable attribute ${attribute}${collection ? "from "+collection+"." : "."}`
		} : undefined);
	}
}