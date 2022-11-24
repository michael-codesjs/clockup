import { EntityType } from "@local-types/api";
import { EntriesFromAttributesSchema, GetSetMutableAttributes, RefinedToAttributeParams, ToAttributeRecord } from "../types/utility";
import { getEntityTypes } from "@utilities/functions";
import { ulid } from "ulid";
import { EntityErrorMessages } from "../types";
import { AttributeSchema, ICommon } from "../types/attributes";
import { Attribute } from "./attribute";
import { IPutable } from "./interfaces";
import { Publisher } from "./publisher";

export class Attributes<T extends (ICommon & Record<string, AttributeSchema<any, boolean>>)> extends Publisher implements IPutable {

	private Attributes: ToAttributeRecord<T> = {} as ToAttributeRecord<T>; // safe to cast, will populate in constructor

	constructor(params: RefinedToAttributeParams<T> = {} as any) {

		super();

		this.Attributes.entityType = new Attribute<EntityType, true>({
			required: true,
			value: "" as EntityType, // safe to cast, validator will stop you from writing it to the table
			validate: entityType => getEntityTypes().includes(entityType),
			immutable: true
		});

		this.Attributes.id = new Attribute<string, true>({ required: true, value: null, validate: value => value.length > 0, immutable: true });
		this.Attributes.created = new Attribute<string, true>({ required: true, value: null, immutable: true });
		this.Attributes.modified = new Attribute<string, true>({ value: null, immutable: true });
		this.Attributes.discontinued = new Attribute<boolean, true>({ value: false, immutable: true });

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
		this.Attributes.discontinued.value = discontinued;
		this.Attributes.created.value = created || new Date().toJSON();
		this.Attributes.id.value = id || ulid();

		for (const key in rest) {
			if (!this.Attributes[key]) continue;
			this.Attributes[key].value = attributes[key];
		}

		this.publish(); // notify subscribers of value changes

	}

	/** set mutable attributes */
	set(attributes: GetSetMutableAttributes<T>) {

		Object.entries(attributes).forEach(([key, value]) => {
			if (!(key in this.Attributes)) return; // REVIEW: not sure at the moment but can throw an error here or console.warn
			const attribute = this.Attributes[key];
			if (attribute.immutable) {
				throw new (Error as any)(EntityErrorMessages.ATTEMPT_TO_MUTATE_IMMUTABLE, {
					cause: `Attempting to mutate mutate immutable attribute ${key}`
				});
			}
			attribute.value = value;
		});

		this.Attributes.modified.value = new Date().toJSON();

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

	putable(): boolean {
		const notPutable = Object.values(this.Attributes).some(attribute => !attribute.putable()); // find at least one attribute that is not putable
		return !notPutable;
	}

	/** get non null values */
	valid(): EntriesFromAttributesSchema<T> {
		return Object.entries(this.Attributes)
			.reduce((collective, [key, value]) => {
				if (value !== null || value !== undefined) {
					collective[key as keyof typeof collective] = value;
				}
				return collective;
			}, {} as EntriesFromAttributesSchema<T>);
	}

}