import * as types from "@local-types/api";
import { Attributes } from "./attributes";
import { IEntity, IGraphQlEntity } from "./interfaces";
import { Keys } from "./keys";
import { Model } from "./model";

/**
 * Base abstract class that all entities and their variants should extend.
 * It implements common functionality shared by all entities and sets rules for them.
 * @constructor
 * @param {Object} properties predefined object properties.
 * @param {types.EntityType} entityType type of entity.
 */

type EntityParams = { id?: string, created?: string, modified?: string, discontinued?: boolean } | null

export abstract class Entity implements IEntity, IGraphQlEntity {

	/** Entity DynamoDB keys for the table and all its Global Secondary Indexes */
	public abstract keys: Keys;
	/** Entity attributes */
	public abstract attributes: Attributes;

	abstract readonly TypeOfSelf: typeof Entity;
	abstract readonly NullTypeOfSelf: typeof Entity;
	abstract readonly AbsoluteTypeOfSelf: typeof Entity | Array<typeof Entity>;

	protected model: Model = new Model(this);

	protected constructor(params:any) {
		
	}

	/**
	 * sets the tables partition and entity index gsi keys.
	 * These are the only keys that should not be handled by the derived entity classes.
	 */

	/**
	 * @returns {Object} GraphQL representation of an entity defined the schema
	 * @abstract
	 */

	graphQlEntity(): (types.ICommom & { [k: string]: any }) | null {
		return this.attributes.collective();
	}

	/**
	 * Keeps the entity in sync with it's record in the database and vice versa.
	 * For Absolute variants of Entity, it upserts the entities attributes into the table.
	 * For Null variants of entities, it gets the attributes from the table and returns an absolute variant of that entity type.
	 * @abstract
	 */
	abstract sync(): Promise<Entity>;

	/**
	 * deletes an entites record from the database
	 */
	async terminate(): Promise<Entity> {
		await this.model.delete();
		const ConstructableNullTypeOfSelf = this.NullTypeOfSelf as new () => Entity;
		return new ConstructableNullTypeOfSelf();
	}

	composable(): boolean {
		return !this.attributes.get("discontinued");
	}

}