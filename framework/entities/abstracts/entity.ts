import { ulid } from "ulid";
import type { EntityType } from "@local-types/api";
import { constructKey } from "@utilities/functions";
import { SyncOptions } from "../types";
import { IEntity } from "./interfaces";
import { Keys } from "./keys";
import { Model, NullModel } from "./model";


export abstract class Entity implements IEntity {

	/* KEYS */
	private Keys = new Keys();
	// only expose the setGSI function and the key getters
	protected setGSI = (params: Parameters<typeof this.Keys.setGSI>[0]) => this.Keys.setGSI(params); // binding the functions to the Keys object did not work so we gotta call these like this
	public primaryKeys = () => this.Keys.primary();
	public GSI_Keys = () => this.Keys.GSIs();
	public keys = () => this.Keys.all();

	/* VARIANTS */
	abstract readonly TypeOfSelf: typeof Entity;
	abstract readonly NullTypeOfSelf: typeof Entity | Array<typeof Entity>;
	abstract readonly AbsoluteTypeOfSelf: typeof Entity | Array<typeof Entity>;

	/* ATTRIBUTES */
	protected readonly Id: string;
	get id() { return this.Id; }
	protected Created: string;
	protected Modified: string;

	/* MODEL */
	protected abstract model: Model | NullModel;

	constructor(properties: { id?: string, created?: string }, readonly entityType: EntityType) {

		const { id, created } = properties;
		this.entityType = entityType;
		this.Id = id || ulid();
		this.Created = created || new Date().toJSON();

		this.setupKeys();

	}

	private setupKeys() {

		this.Keys.setPrimary({
			partition: constructKey(this.entityType, this.Id)
		});

		this.Keys.setEntity({
			entity: this.entityType,
			sort: ""
		});

	}

	get putItemInput() {
		return {
			...this.keys(),
			...this.attributes()
		};
	}

	abstract attributes(): any; // entity specific attributes
	abstract mutableAttributes(): any;
	abstract setAttributes(attributes: Record<string, any>): void;

	/*
	 * Sync and Unsync functions should be the only functions to work with the model
	 * for absolute sub classes, sync should insert/update/delete the entity record in the database
	 * for null sub classes, sync should fetch the entity record from the db and return an absolute type of self
	 */

	abstract sync(syncOptions: SyncOptions): Promise<Entity>;
	async unsync(): Promise<Entity> {
		await this.model.delete();
		return this;
	}

	/* END */

	public graphqlEntity(): any {
		return {
			id: this.Id,
			entityType: this.entityType,
			created: this.Created,
			modified: this.Modified
		};
	}

}