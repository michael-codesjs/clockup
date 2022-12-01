import { AttributeParams } from "../types";
import { IPutable } from "./interfaces";

export class Attribute<T = any, I = false> implements IPutable {

	protected readonly Required: boolean;
	protected Value: T;
	public readonly immutable: I;
	private readonly validate: AttributeParams<T, I>["validate"] = () => true;

	constructor({ required, validate, value, immutable }: AttributeParams<T, I>) {
		this.Required = required || false;
		this.Value = value;
		this.immutable = immutable;
		this.validate = validate ? validate : this.validate;
	}

	get value() { return this.Value; }

	set value(value: T) {
		if (!this.validate(value)) throw new Error("Invalid value for attribute");
		if (Array.isArray(value)) {
			this.Value = (this.Value as Array<any> || []).concat(value) as T;
		} else if (typeof value === "object") {
			this.Value = {
				...this.Value,
				...value,
			};
		} else {
			this.Value = value;
		}
	}

	override(value: T) {
		if (!this.validate(value)) throw new Error("Invalid value for attribute");
		this.Value = value;
	}

	/** Determines if an attribute can be written to the database */
	putable(): boolean {
		return (
			(this.Required ? this.value !== undefined && this.value !== null : true) && this.validate(this.Value)
		);
	}

}