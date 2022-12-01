import { ICreatable } from "@local-types/api";
import { EntityErrorMessages } from "../types";
import { AttributeSchema, ICommon } from "../types/attributes";
import { Attributes } from "./attributes";
import { IGraphQlEntity } from "./interfaces";
import { Keys } from "./keys";
import { Model } from "./model";

/**
 * Base abstract class that all entities and their variants should extend.
 * It implements common functionality shared by all entities and sets rules for them.
 * @constructor
 * @param {Object} properties predefined object properties.
 * @param {types.EntityType} entityType type of entity.
 */

export abstract class Entity implements IGraphQlEntity {

	/** Entity attributes */
	public abstract attributes: Attributes<ICommon>;
	/** Entity DynamoDB keys for the table and all its Global Secondary Indexes */
	public abstract keys: Keys;

	abstract readonly TypeOfSelf: typeof Entity;
	abstract readonly NullTypeOfSelf: typeof Entity;
	abstract readonly AbsoluteTypeOfSelf: typeof Entity | Array<typeof Entity>;

	protected readonly model: Model = new Model(this);

	constructor({ }: {} = {}) { } // {}: {} = {} is for constructor signature purposes only
	/*eslint no-empty-pattern: "off"*/

	/**
	 * @returns {Object extends types.ICommon} GraphQL representation of an entity defined the schema
	 * @abstract
	 */

	graphQlEntity(): null | Record<string, any> {
		return null;
	}

	/**
	 * Keeps the entity in sync with it's record in the database and vice versa.
	 * For Absolute variants of Entity, it upserts the entities attributes into the table.
	 * For Null variants of entities, it gets the attributes from the table and returns an absolute variant of that entity type.
	 * @abstract
	 */
	abstract sync(): Promise<Entity>;

	/** inserts an entities record into the table */

	async put(): Promise<Entity> {
		if(this.TypeOfSelf === this.NullTypeOfSelf) throw new Error("Can not insert record of null entity into the table");
		if(!this.attributes.putable()) throw new Error(EntityErrorMessages.INSUFFICIENT_ATTRIBUTES_TO_PUT);
		await this.model.put();
		return this;
	}

	/** deletes an entites record from the database(legacy) */
	async terminate(): Promise<Entity> {
		if(this.TypeOfSelf === this.NullTypeOfSelf) throw new Error("Null variant of entity can not be used to terminate an entity");
		await this.model.delete();
		const ConstructableNullTypeOfSelf = this.NullTypeOfSelf as new () => Entity;
		return new ConstructableNullTypeOfSelf();
	}

	/** discontinues an entity */
	async discontinue(): Promise<Entity> {
		if(this.TypeOfSelf === this.NullTypeOfSelf) throw new Error(EntityErrorMessages.NULL_VARIANT_RESTRICTION);
		this.attributes.parse({
			...this.attributes.valid(),
			discontinued: true
		});
		await this.model.discontinue();
		return this;
	}

	composable(): boolean {
		return !this.attributes.get("discontinued");
	}

}