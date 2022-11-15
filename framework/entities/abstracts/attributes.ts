import { EntityType, ICommon } from "@local-types/api";
import { RefinedToAttributeParams } from "@local-types/utility";
import { ulid } from "ulid";
import { AttributesParams, ImmutableAttributes } from "../types";
import { Attribute } from "./attribute";
import { IPutable } from "./interfaces";
import { Publisher } from "./publisher";

// TODO: will come back to this and properly type everything out

type ToAttributeRecord<T extends Record<string, any>> = {
  [Key in keyof T]: Attribute<T[Key], boolean>
};

export class Attributes<T extends Record<string, any>> extends Publisher implements IPutable {

	private Attributes: ToAttributeRecord<T> & ToAttributeRecord<ICommon> = {} as ToAttributeRecord<T> & ToAttributeRecord<ICommon>;

	constructor(params: RefinedToAttributeParams<T>) {

		super();

		this.Attributes = {

			entityType: new Attribute<EntityType, true>({
				required: true,
				value: "Entity" as EntityType, // safe to cast, validator will stop you from writing it to the table
				validate: entityType => Object.values(EntityType).includes(entityType),
				immutable: true
			}),

			id: new Attribute<string, true>({ required: true, value: null, validate: value => value.length > 0, immutable: true }),
			created: new Attribute<string, true>({ required: true, value: null || new Date().toJSON(), immutable: true }),
			modified: new Attribute({ value: null }),
			discontinued: new Attribute({ value: null })
    
		} as typeof this.Attributes;

		Object.entries(params).forEach(([key, value]) => {
			const { initial, ...rest } = value;
			this.attributes = {
				[key]: new Attribute({ ...rest, value: initial })
			} as any;
		});

	}

	parse(attributes: Partial<T> & AttributesParams) {

		const { entityType, discontinued, created, id, ...rest } = attributes;

		// some special cases were we set things manually
		this.Attributes.entityType.value = entityType;
		this.Attributes.discontinued.value = discontinued || false;
		this.Attributes.created.value = created || new Date().toJSON();
		this.Attributes.id.value = id || ulid();

		for (const key in rest) {
			if(!this.Attributes[key]) continue;
			this.Attributes[key].value = attributes[key];
		}

		this.publish();

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
			if (attribute.immutable) return;
			attribute.value = value;
		});
		this.Attributes.modified.value = new Date().toJSON();
		this.publish(); // notify subscribers of changes made to the attributes
	}

	get<K extends keyof (ICommon & T)>(attribute: K): (ICommon & T)[K] {
		return this.Attributes[attribute as keyof (ICommon & T)]?.value;
	}

	/**
   * @method
   * @abstract
   * @returns {types.ICommom & Record<string, any>} an entities attributes
   */
	collective(): T {
		const collective: T & ICommon = {} as T & ICommon;
		for (const key in this.Attributes) {
			const attribute = this.Attributes[key];
			collective[key as keyof T & ICommon] = attribute.value;
		}
		return collective;
	}

	putable(): boolean {
		const notPutable = Object.values(this.Attributes).some(attribute => attribute.putable() === false);
		return !notPutable;
	}

}