import { dynamoDbClient } from "../lib/dynamoDb";
import { isLiteralArray } from "../utilities/functions";
import { InvalidAttribute } from "./error-types";
import { IPutable, IUpdateable } from "./interfaces";
import { AttributeParams } from "./types";

export class Attribute<T = any, I = false> implements IPutable, IUpdateable {

	protected readonly required: boolean;
	public readonly immutable: I;
	private readonly validate: AttributeParams<T, I>["validate"] = () => true;

	protected Modified: Date | null;
	protected Value: T;

	constructor({ required, validate, value, immutable }: AttributeParams<T, I>) {
		this.required = required || false;
		this.Value = value;
		this.immutable = immutable;
		this.validate = validate ? validate : this.validate;
	}

	get value() { return this.Value; }

	setValue(value: T, modified: Date = new Date()) {
		if (!this.validate(value)) throw new InvalidAttribute(value as string);
		this.Value = value;
		this.setModified(modified);
	}

	override(value: T, modified: Date = new Date()) {
		if (!this.validate(value)) throw new InvalidAttribute(value as string);
		this.Value = value;
		this.setModified(modified);
	}

	setModified(date: Date = new Date()) {
		this.Modified = date;
	}

	get modified() {
		return this.Modified;
	}

	/** checks if an attribute can be written to the table */
	isPutable(): boolean {
		return (
			(this.required ? this.value !== undefined && this.value !== null : true) && this.validate(this.Value)
		);
	}

	/** return version/structure/state of attribute that can be written to the table, example: Date to Date.toJSON() */
	putable() {
		if (this.Value instanceof Date) return this.Value.toJSON();
		if(isLiteralArray(this.Value)) return dynamoDbClient.createSet(Array.from(this.Value));
		return this.Value;
	}

	/** checks if an attribute was modified at the same time as the collection it belongs to. */
	isUpdateable(date?: Date): boolean {
		if (this.immutable) return false;
		if (date && this.modified) return (date.valueOf() === this.modified.valueOf()) && this.valid() && this.validate(this.Value);
		else if (this.valid() && this.validate(this.Value)) return true;
		else return false;
	}

	/** get version/structure/state of attribute that can be written to table */
	updateable() {
		return this.putable();
	}

	/** check if value is non null */
	valid() {
		return this.Value !== null && this.Value !== undefined;
	}

}