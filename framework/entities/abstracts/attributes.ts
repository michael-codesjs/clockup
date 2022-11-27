import { EntityType } from "@local-types/api";
import { getEntityTypes } from "@utilities/functions";
import { ulid } from "ulid";
import { MutateImmutable } from "../error";
import { AttributeSchema, ICommon } from "../types/attributes";
import { EntriesFromAttributesSchema, GetSetMutableAttributes, GetSetSetsFromAttributeSchema, RefinedToAttributeParams, ToAttributeRecord } from "../types/utility";
import { Attribute } from "./attribute";
import { IPutable } from "./interfaces";
import { Publisher } from "./publisher";

export class Attributes<T extends (ICommon & Record<string, AttributeSchema<any, boolean>>)> extends Publisher implements IPutable {

	private Attributes: ToAttributeRecord<T> = {} as ToAttributeRecord<T>; // safe to cast, will populate in constructor

	constructor(params: RefinedToAttributeParams<T> = {} as any) {
		super(); // publisher
		this.defineICommon();
		this.defineT(params);
	}

	private defineICommon() {

		this.Attributes.entityType = new Attribute<EntityType, true>({
			required: true,
			value: "" as EntityType, // safe to cast, validator will stop you from writing it to the table
			validate: entityType => getEntityTypes().includes(entityType),
			immutable: true
		});

		this.Attributes.id = new Attribute<string, true>({
			required: true,
			value: null,
			validate: value => typeof value === "string" && value.length > 0,
			immutable: true
		});

		this.Attributes.created = new Attribute<string, true>({ required: true, value: null, immutable: true });
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

		const { entityType, discontinued, created, id, ...rest } = attributes;

		// some special cases were we set things manually
		this.Attributes.entityType.value = entityType;
		this.Attributes.discontinued.value = typeof discontinued !== "boolean" ? false : discontinued;
		this.Attributes.created.value = created || new Date().toJSON();
		this.Attributes.id.value = id || ulid();

		for (const key in rest) {
			if (!this.Attributes[key]) continue;
			this.Attributes[key].value = attributes[key];
		}

		this.publish(); // notify subscribers of value changes

	}

	private forEachOnMutate(
		attributes: Partial<EntriesFromAttributesSchema<T>>,
		setter?: (
			attribute: (typeof this.Attributes)[keyof EntriesFromAttributesSchema<T>],
			value: EntriesFromAttributesSchema<T>[keyof EntriesFromAttributesSchema<T>],
			key: string
		) => void
	) {

		for (let key in attributes) {
			if (!(key in this.Attributes)) continue;
			const value = attributes[key];
			const attribute = this.Attributes[key];
			setter(attribute, value, key);
		}

		this.Attributes.modified.value = new Date().toJSON();

		this.publish(); // notify subscribers of value changes

	}

	/** set mutable attributes */
	set(attributes: GetSetMutableAttributes<T>) {

		this.forEachOnMutate(attributes as EntriesFromAttributesSchema<T>, (attribute, value, key) => {
			if (attribute.immutable) throw new MutateImmutable(key); // can not mutate immutable attribute via set
			attribute.value = value;
		});

	}

	/** overrides sets */
	override(sets: GetSetSetsFromAttributeSchema<T>) {

		this.forEachOnMutate(sets as EntriesFromAttributesSchema<T>, (attribute, value) => {
			attribute.override(value);
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
				if (value.value !== null && value.value !== undefined) {
					collective[key as keyof typeof collective] = value.value;
				}
				return collective;
			}, {} as Partial<EntriesFromAttributesSchema<T>>);
	}

	putable(): boolean {
		const notPutable = Object.values(this.Attributes).some(attribute => !attribute.putable()); // find at least one attribute that is not putable
		return !notPutable;
	}

}