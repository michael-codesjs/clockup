import { EntityType } from "@local-types/api";
import { getEntityTypes } from "@utilities/functions";
import { ulid } from "ulid";
import { MutateImmutable } from "../error";
import { AttributeSchema, ICommon } from "../types/attributes";
import { EntriesFromAttributesSchema, GetSetMutableAttributes, GetSetSetsFromAttributeSchema, RefinedToAttributeParams, ToAttributeRecord } from "../types/utility";
import { Attribute } from "./attribute";
import { IPutable, IUpdateable } from "./interfaces";
import { Publisher } from "./publisher";

export class Attributes<T extends (ICommon & Record<string, AttributeSchema<any, boolean>>)> extends Publisher implements IPutable, IUpdateable {

	private Attributes: ToAttributeRecord<T> = {} as ToAttributeRecord<T>; // safe to cast, will populate in constructor

	constructor(params: RefinedToAttributeParams<T> = {} as any) {
		super(); // publisher
		this.defineICommon();
		this.defineT(params);
	}

	private defineICommon() {

		this.Attributes.entityType = new Attribute<EntityType, true>({
			required: true,
			value: "" as EntityType, // safe to cast, validator will stop you from writing it to the table anyway
			validate: entityType => getEntityTypes().includes(entityType),
			immutable: true
		});

		this.Attributes.id = new Attribute<string, true>({
			required: true,
			value: null,
			validate: value => typeof value === "string" && value.length > 0,
			immutable: true
		});

		this.Attributes.created = new Attribute<string, true>({ required: true, value: new Date().toJSON(), immutable: true });
		this.Attributes.modified = new Attribute<string, true>({ value: null, immutable: true });

		this.Attributes.discontinued = new Attribute<boolean, true>({
			value: null,
			immutable: true,
			validate: value => typeof value === "boolean"
		});

	}

	private defineT(params: ConstructorParameters<typeof Attributes>[0]) {
		Object.entries(params).forEach(([key, value]) => {
			const { initial, ...rest } = value;
			this.Attributes[key as keyof typeof this.Attributes] = new Attribute({ ...rest, value: initial });
		});
	}

	/** set values of attributes including immutable values */
	parse(attributes: Partial<EntriesFromAttributesSchema<T>>) {

		const { entityType, discontinued, created, id, modified, ...rest } = attributes;

		const _created = created || new Date().toJSON();
		const _modified = modified ? new Date(modified) : null;

		// some special cases were we set things manually
		this.Attributes.entityType.setValue(entityType, _modified);
		this.Attributes.discontinued.setValue(typeof discontinued !== "boolean" ? false : discontinued, _modified);
		this.Attributes.created.setValue(_created, _modified);
		this.Attributes.modified.setValue(_modified && _modified.toJSON(), _modified);
		this.Attributes.id.setValue(id || ulid(), _modified);

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

	/** set mutable attributes */
	set(attributes: GetSetMutableAttributes<T>) {

		this.forEachOnMutate(attributes as EntriesFromAttributesSchema<T>, (value, key, modified) => {
			const attribute = this.Attributes[key];
			if (attribute.immutable) throw new MutateImmutable(key); // can not mutate immutable attribute via set
			attribute.setValue(value, modified);
		});

	}

	/** overrides sets */
	override(sets: GetSetSetsFromAttributeSchema<T>) {

		this.forEachOnMutate(sets as EntriesFromAttributesSchema<T>, (value, key, modified) => {
			this.Attributes[key].override(value, modified);
		});

		this.publish(); // notify subscribers of value changes

	}

	/** get an attributes value */
	get<K extends keyof T>(attribute: K): T[K]["type"] {
		return this.Attributes[attribute].value;
	}

	/** get all attribute values */
	collective(): EntriesFromAttributesSchema<T> {
		const collective: EntriesFromAttributesSchema<T> = {} as EntriesFromAttributesSchema<T>; // safe to cast, will fill up below
		for (const key in this.Attributes) {
			const attribute = this.Attributes[key];
			collective[key] = attribute.value;
		}
		return collective;
	}

	/** get all non null values */
	valid(): Partial<EntriesFromAttributesSchema<T>> {
		return Object.entries(this.Attributes)
			.reduce((collective, [key, value]) => {
				if (value.value !== null && value.value !== undefined && value.putable()) {
					collective[key as keyof typeof collective] = value.value;
				}
				return collective;
			}, {} as Partial<EntriesFromAttributesSchema<T>>);
	}

	/** checks if we have enough values to write to the table */
	isPutable(): boolean {
		// attributes collection is not putable if at least one of it's attributes are not putable
		return !(Object.values(this.Attributes).some(attribute => !attribute.isPutable()));
	}

	/** get putable version of attributes */
	putable() {
		return this.entries()
			.reduce((cumulative, [key, value]) => {
				if (value.isPutable()) cumulative[key as keyof EntriesFromAttributesSchema<T>] = value.putable();
				return cumulative;
			}, {} as EntriesFromAttributesSchema<T>);
	}
	/** checks if we have values we can update */
	isUpdateable(): boolean {
		return Object.values(this.Attributes).some(attribute => attribute.isUpdateable());
	}

	updateable() {
		return this.entries()
			.reduce((cumulative, [key, value]) => {
				if (value.isUpdateable(new Date(this.get("modified")))) cumulative[key as keyof EntriesFromAttributesSchema<T>] = value.updateable();
				return cumulative;
			}, {} as EntriesFromAttributesSchema<T>)
	}

	/** list of all attributes */
	keys<R extends T = T>(): Array<keyof R> {
		return Object.keys(this.Attributes);
	}

	private entries<R extends T = T>(): Array<[keyof R, ToAttributeRecord<R>[keyof R]]> {
		return Object.entries(this.Attributes);
	}

}