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

export abstract class Entity implements IEntity, IGraphQlEntity {

	/** Entity DynamoDB keys for the table and all its Global Secondary Indexes */
	public abstract keys: Keys;
	/** Entity attributes */
	public abstract attributes: Attributes<types.ICommon>;

	abstract readonly TypeOfSelf: typeof Entity;
	abstract readonly NullTypeOfSelf: typeof Entity;
	abstract readonly AbsoluteTypeOfSelf: typeof Entity | Array<typeof Entity>;

	protected model: Model = new Model(this);

	constructor({ }: {} = {}) { } // {}: {} = {} is for constructor signature purposes

	/**
	 * @returns {Object extends types.ICommon} GraphQL representation of an entity defined the schema
	 * @abstract
	 */

	graphQlEntity(): null | Record<string, any> {
		return null
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