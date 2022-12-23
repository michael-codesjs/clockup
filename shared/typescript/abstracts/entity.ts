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
	/** Entity state */
	protected abstract state: IEntityState;

	constructor({ }: {} = {}) { } // {}: {} = {} is for constructor signature purposes only
	/*eslint no-empty-pattern: "off"*/

	setState(State: new (context: Entity) => IEntityState) {
		this.state = new State(this);
	}

	graphQlEntity() {
		return this.state.graphQlEntity();
	}

	/** Keeps the entity in sync with it's record in the table. */
	async sync() {
		return await this.state.sync();
	}

	/** Inserts an entities record into the table */
	async put(): Promise<Entity> {
		return await this.state.put();
	}

	/** deletes an entites record from the database */
	async terminate(): Promise<Entity> {
		return await this.state.terminate();
	}

	/** discontinues an entity */
	async discontinue(): Promise<Entity> {
		return await this.state.discontinue();
	}

	composable(): boolean {
		return !this.attributes.get("discontinued");
	}

}