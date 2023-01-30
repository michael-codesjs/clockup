import { ulid } from "ulid";
import { getEntityTypes } from "../utilities/functions";
import { Attribute } from "./attribute";
import { MutateImmutable } from "./error-types";
import { IPutable, IUpdateable } from "./interfaces";
import { Publisher } from "./publisher";
import { AttributeSchema, CommonAttributes } from "./types";
import { EntriesFromAttributesSchema, GetSetMutableAttributes, GetSetSetsFromAttributeSchema, RefinedToAttributeParams, ToAttributeRecord } from "./types/utility";

type CommonAttributesPlusOthers = CommonAttributes & Record<string, AttributeSchema<any, boolean>>;

export class Attributes<T extends CommonAttributesPlusOthers> extends Publisher implements IPutable, IUpdateable {

	private Attributes: ToAttributeRecord<T> = {} as typeof this.Attributes; // safe to cast, will populate in constructor

	constructor(params: RefinedToAttributeParams<T> = {} as any) {
		super(); // publisher
		this.defineT(params);
		this.defineICommon();
	}

	/** Instaciates Common attributes -> new Attributes */
	protected defineICommon() {

		this.Attributes.entityType = new Attribute<T["entityType"]["type"], true>({
			required: true,
			value: null as T["entityType"]["type"], // safe to cast, validator will stop you from writing it to the table anyway
			validate: entityType => getEntityTypes().includes(entityType),
			immutable: true
		});

		this.Attributes.id = new Attribute<string, true>({
			required: true,
			value: null,
			validate: value => typeof value === "string" && value.length > 0,
			immutable: true
		});

		this.Attributes.creator = new Attribute<string, true>({
			required: true,
			value: null,
			validate: value => value === null || (typeof value === "string" && value.length > 0),
			immutable: true
		});

		this.Attributes.creatorType = new Attribute<T["creatorType"]["type"], true>({
			required: true,
			value: null,
			validate: creatorType => getEntityTypes().includes(creatorType),
			immutable: true
		});

		this.Attributes.created = new Attribute<string, true>({
			required: true,
			value: new Date().toJSON(),
			immutable: true
		});

		this.Attributes.modified = new Attribute<string, true>({
			value: null,
			immutable: true
		});

		this.Attributes.discontinued = new Attribute<boolean, true>({
			value: false,
			immutable: true,
			validate: value => typeof value === "boolean"
		});

	}

	/** Instaciates generic attributes -> new Attribute*/
	private defineT(params: ConstructorParameters<typeof Attributes>[0]) {
		Object.entries(params).forEach(([key, value]) => {
			const { initial, ...rest } = value;
			this.Attributes[key as keyof typeof this.Attributes] = new Attribute({ ...rest, value: initial });
		});
	}

	/** set values of attributes including immutable values. */
	// not advisable to be used in higher level code(eg: lambda functions)
	parse(attributes: Partial<EntriesFromAttributesSchema<T>>) {

		const { entityType, discontinued, created, id, creator, modified, creatorType, ...rest } = attributes;

		const _created = created || new Date().toJSON();
		const _modified = modified ? new Date(modified) : null;

		// some special cases were we set things manually
		this.Attributes.entityType.setValue(entityType, _modified);
		this.Attributes.discontinued.setValue(typeof discontinued !== "boolean" ? false : discontinued, _modified);
		this.Attributes.created.setValue(_created, _modified);
		this.Attributes.modified.setValue(_modified && _modified.toJSON(), _modified);
		this.Attributes.id.setValue(id || ulid(), _modified);

		if (creator && creatorType) {
			this.Attributes.creator.setValue(creator, _modified);
			this.Attributes.creatorType.setValue(creatorType, _modified);
		} else {
			this.Attributes.creator.setValue(this.Attributes.id.value, _modified);
			this.Attributes.creatorType.setValue(this.Attributes.entityType.value);
		}

		for (const key in rest) {
			if (!this.Attributes[key]) continue;
			this.Attributes[key].setValue(attributes[key], _modified);
		}

		this.publish(); // notify subscribers of value changes

	}

	private forEachOnMutate(
		attributes: Partial<EntriesFromAttributesSchema<T>>,
		setter: (value: any, key: string, modified?: Date) => void // REVIEW: properly type this
	) {

		const modified = new Date();
		this.Attributes.modified.setValue(modified.toJSON());

		for (const key in attributes) {
			if (!(key in this.Attributes)) continue;
			const value = attributes[key];
			setter(value, key, modified);
		}

		this.publish(); // notify subscribers of value changes

	}

	/** Set mutable attributes */
	set(attributes: GetSetMutableAttributes<T>) {

		this.forEachOnMutate(attributes as EntriesFromAttributesSchema<T>, (value, key, modified) => {
			const attribute = this.Attributes[key];
			if (attribute.immutable) throw new MutateImmutable(key); // can not mutate immutable attribute via set
			attribute.setValue(value, modified);
		});

	}

	/** Overrides sets and arrays */
	override(sets: GetSetSetsFromAttributeSchema<T>) {

		this.forEachOnMutate(sets as EntriesFromAttributesSchema<T>, (value, key, modified) => {
			this.Attributes[key].override(value, modified);
		});

		this.publish(); // notify subscribers of value changes

	}

	/** Get an attributes value */
	get<K extends keyof T>(attribute: K): T[K]["type"] {
		return this.Attributes[attribute].value;
	}

	/** Get all attribute values */
	collective(): EntriesFromAttributesSchema<T> {
		const collective: EntriesFromAttributesSchema<T> = {} as EntriesFromAttributesSchema<T>; // safe to cast, will fill up below
		for (const key in this.Attributes) {
			const attribute = this.Attributes[key];
			collective[key] = attribute.value;
		}
		return collective;
	}

	/** Get all non null values */
	valid(): Partial<EntriesFromAttributesSchema<T>> {
		return Object.entries(this.Attributes)
			.reduce((collective, [key, value]) => {
				if (value.valid()) {
					collective[key as keyof typeof collective] = value.value;
				}
				return collective;
			}, {} as Partial<EntriesFromAttributesSchema<T>>);
	}

	/** Checks if we have enough values to write to the table */
	isPutable(): boolean {
		// attributes collection is not putable if at least one of it's attributes are not putable
		return !(Object.values(this.Attributes).some(attribute => !attribute.isPutable()));
	}

	/** Get putable version of attributes */
	putable() {
		return this.entries()
			.reduce((cumulative, [key, value]) => {
				if (value.isPutable()) cumulative[key as keyof EntriesFromAttributesSchema<T>] = value.putable();
				return cumulative;
			}, {} as EntriesFromAttributesSchema<T>);
	}

	/** Checks if we have values we can update */
	isUpdateable(): boolean {
		return Object.values(this.Attributes).some(attribute => attribute.isUpdateable());
	}

	/** Get updatable versions of attributes */
	updateable() {
		return this.entries()
			.reduce((cumulative, [key, value]) => {
				if (value.isUpdateable(new Date(this.get("modified")))) cumulative[key as keyof EntriesFromAttributesSchema<T>] = value.updateable();
				return cumulative;
			}, {} as EntriesFromAttributesSchema<T>);
	}

	/** Gets list of all attributes */
	keys<R extends T = T>(): Array<keyof R> {
		return Object.keys(this.Attributes);
	}

	private entries<R extends T = T>(): Array<[keyof R, ToAttributeRecord<R>[keyof R]]> {
		return Object.entries(this.Attributes);
	}

}