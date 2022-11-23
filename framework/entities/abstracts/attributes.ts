import { EntityType, ICommon } from "@local-types/api";
import { RefinedToAttributeParams } from "@local-types/utility";
import { getEntityTypes } from "@utilities/functions";
import { ulid } from "ulid";
import { EntityErrorMessages, ImmutableAttributes } from "../types";
import { Attribute } from "./attribute";
import { IPutable } from "./interfaces";
import { Publisher } from "./publisher";

type ToAttributeRecord<T extends ICommon> = {
	[Key in keyof T]: Attribute<T[Key], boolean>
};

export class Attributes<T extends (ICommon & Record<string, any>)> extends Publisher implements IPutable {

	private Attributes: ToAttributeRecord<T> = {} as ToAttributeRecord<T>;

	constructor(params: RefinedToAttributeParams<T>) {

		super();

		this.Attributes.entityType = new Attribute<EntityType, true>({
			required: true,
			value: "" as EntityType, // safe to cast, validator will stop you from writing it to the table
			validate: entityType => getEntityTypes().includes(entityType),
			immutable: true
		});

		this.Attributes.id = new Attribute<string, true>({ required: true, value: null, validate: value => value.length > 0, immutable: true });
		this.Attributes.created = new Attribute<string, true>({ required: true, value: null || new Date().toJSON(), immutable: true });
		this.Attributes.modified = new Attribute<string, false>({ value: null });
		this.Attributes.discontinued = new Attribute<boolean, false>({ value: false });

		Object.entries(params).forEach(([key, value]) => {
			const { initial, ...rest } = value;
			this.Attributes[key as keyof typeof this.Attributes] = new Attribute({ ...rest, value: initial });
		});

	}

	/** set values of attributes including immutable values */
	parse(attributes: Partial<T>) {

		const { entityType, discontinued, created, id, ...rest } = attributes;

		// some special cases were we set things manually
		this.Attributes.entityType.value = entityType;
		this.Attributes.discontinued.value = discontinued || false;
		this.Attributes.created.value = created || new Date().toJSON();
		this.Attributes.id.value = id || ulid();

		for (const key in rest) {
			if (!this.Attributes[key]) continue;
			this.Attributes[key].value = attributes[key];
		}

		this.publish(); // notify subscribers of value changes

	}

	protected set attributes(attributes: typeof this.Attributes) {
		this.Attributes = {
			...this.Attributes,
			...attributes
		};
	}

	set(attributes: Partial<Omit<T, ImmutableAttributes>>) { // TODO: extract immutable types from T
		Object.entries(attributes).forEach(([key, value]) => {
			if (!(key in this.Attributes)) return; // REVIEW: not sure at the moment but can throw an error here or console.warn
			const attribute = this.Attributes[key];
			if (attribute.immutable) throw new Error(EntityErrorMessages.ATTEMPT_TO_MUTATE_IMMUTABLE);
			attribute.value = value;
		});
		this.Attributes.modified.value = new Date().toJSON();
		this.publish(); // notify subscribers of value changes
	}

	/** get a single attributes value */
	get<K extends keyof T>(attribute: K): T[K] {
		return this.Attributes[attribute].value;
	}

	/** get a collection of desired attribute values*/
	gets<K extends Array<keyof T>>(attributes: K): Record<K[number], T[K[number]]> {
		return attributes.reduce((collective, key) => {
			collective[key] = this.get(key);
			return collective;
		}, {} as Record<K[number], T[K[number]]>);
	}

	/** get all attribute values */
	collective(): T {
		const collective: T = {} as T;
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

}