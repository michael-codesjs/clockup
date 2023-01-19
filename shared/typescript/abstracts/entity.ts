import { Attributes } from "./attributes";
import { IEntity, IGraphQlEntity, IEntityState } from "./interfaces";
import { Keys } from "./keys";
import { CommonAttributes } from "./types";

/**
 * Base abstract class that all entities and their variants should extend.
 * It implements common functionality shared by all entities and sets rules for them.
 * @constructor
 * @param {Object} properties predefined object properties.
 * @param {types.EntityType} entityType type of entity.
 */

export abstract class Entity implements IGraphQlEntity, IEntity {

	/** Entity attributes */
	public abstract attributes: Attributes<CommonAttributes>;
	/** Entity DynamoDB keys for the table and all its Global Secondary Indexes */
	public abstract keys: Keys;

	constructor({ }: {} = {}) { } // {}: {} = {} is for constructor signature purposes only
	/*eslint no-empty-pattern: "off"*/

	/** Returns an entity's GraphQL representation. */
	abstract graphQlEntity(): Promise<Record<string, any>>;

	/** Keeps the entity in sync with it's record in the table. */
	abstract sync(): Promise<Record<string, any>>;

	/** Inserts an entities record into the table */
	abstract put(): Promise<Entity>;

	/** Discontinues an entity */
	abstract discontinue(): Promise<Entity>;
	
	/** Continues a discontinued entity */
	abstract continue(): Promise<Entity>;

	composable(): boolean {
		return !this.attributes.get("discontinued");
	}

}