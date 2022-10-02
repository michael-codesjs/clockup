import { ulid } from "ulid";
import * as types from "@local-types/api";
import { constructKey } from "@utilities/functions";
import { SyncOptions } from "../types";
import { IEntity } from "./interfaces";
import { Keys } from "./keys";
import { Model } from "./model";


/**
 * Base abstract class that all entities and their variants should extend.
 * It implements common functionality shared by all entities and sets rules for them.
 * @constructor
 * @param {Object} properties predefined object properties.
 * @param {types.EntityType} entityType type of entity.
 */

export abstract class Entity implements IEntity {

	/** Entity DynamoDb keys for the table and all its Global Secondary Index */
	public Keys = new Keys();

	abstract readonly TypeOfSelf: typeof Entity;
	abstract readonly NullTypeOfSelf: typeof Entity;
	abstract readonly AbsoluteTypeOfSelf: typeof Entity | Array<typeof Entity>;

	protected EntityType: types.EntityType;
	protected Id: string;
	protected Created: string; // REVIEW: got a feeling should be readonly, not sure at the moment.
	protected Modified: string;
	/** Attributes absolutely needed for inserting a record into the table  */
	protected abstract PrimaryAttributes: Array<string>;

	protected model: Model = new Model(this);

	protected constructor(properties: { id?: string, created?: string } | null, type: types.EntityType) {
		// constructor is protected for entity variants that may offer a static creational method and private constructor.
		const { id, created } = properties = properties || {};
		this.EntityType = type;
		this.Id = "id" in properties ? id! : ulid();
		this.Created = "created" in properties ? created! : new Date().toJSON();
		this.Modified = this.Created;
		this.setBaseKeys();
	}

	/**
	 * sets the tables partition and entity index gsi keys.
	 * These are the only keys that should not be handled by the derived entity classes.
	 */
	private setBaseKeys() {

		this.Keys.setPrimary({
			partition: constructKey(this.EntityType, this.Id)
		});

		this.Keys.setEntity({
			entity: this.EntityType,
			sort: this.Created
		});

	}

	/**
	 * Returns an entities attributes
	 * @method
	 * @abstract
	 * @returns {types.ICommom & Record<string, any>} an entities attributes
	 */
	attributes(): (types.ICommom & Record<string, any>) | null {
		return {
			id: this.Id,
			created: this.Created,
			modified: this.Modified,
			entityType: this.EntityType,
		};
	}

	public nonNullAttributes(attributes: Record<string, any>): Record<string, any> {
		return Object.entries(attributes)
			.reduce((cumulative, current) => {
				const [key, value] = current;
				if (value !== null && value !== undefined) cumulative[key] = value;
				return cumulative;
			}, {});
	}

	/**
	 * @returns {Object} type matching definition in the GraphQL Schema
	 * @abstract
	 */

	graphQlEntity(): (types.ICommom & { [k: string]: any }) | null {
		return this.attributes();
	}

	setAttributes(attributes: Record<string, any> | null) {
		if (!attributes) return;
		Object.entries(attributes).forEach( // loop throught every attribute supplied, Object.entries: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/entries
			([key, value]) => {
				if (key === "id") return;
				key = key[0].toUpperCase() + key.slice(1, key.length); // turn "key" to "Key" because that's how attribute keys are stored in 
				if (key in this) { // check if the attributes should exist, we do not want to add none existent attributes,
					this[key] = value;
				}
			}
		);
		this.set_GSI_keys(); // update GSI keys since some may be dependent on the attributes
	}

	/* checks if the primary attributes are set for creation */
	protected validatePrimaryAttributes(): boolean {
		return this.PrimaryAttributes.every(attribute => {
			const value = this[attribute];
			return value !== null && value !== undefined;
		})
	}

	/**
	 * Sets an entities GSI partition keys.
	 * @abstract
	 */
	protected abstract set_GSI_keys(): void;

	/**
	 * Keeps the entity in sync with it's record in the database and vice versa.
	 * For Absolute variants of entities, it upserts the entities attributes into the table.
	 * For Null variants of entities, it gets the attributes from the table and updates the entity with the fetched attributes.
	 * @abstract
	 * @param syncOptions 
	 */
	abstract sync(syncOptions: SyncOptions): Promise<Entity>;

	/**
	 * deletes an entites record from the database
	 * @returns {boolean} delete result
	 */
	async terminate(): Promise<Entity> {
		await this.model.delete();
		const ConstructableNullTypeOfSelf = this.NullTypeOfSelf as new () => Entity;
		return new ConstructableNullTypeOfSelf();
	}

	get id() {
		return this.Id;
	}

}