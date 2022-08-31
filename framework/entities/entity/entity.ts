import { v4 } from "uuid";
import { EntityType } from "../../../types/api";
import { Model, NullModel } from "./model";
import { constructKey } from "../../../utilities/functions";
import { SyncOptions } from "../types";


export abstract class Entity {

  abstract readonly TypeOfSelf: typeof Entity;
  abstract readonly NullTypeOfSelf: typeof Entity;
  abstract readonly AbsoluteTypeOfSelf: typeof Entity;

  // readonly entityType: EntityType; // gotta be a function type so that I can use it in the constructor
  protected readonly id: string;
  protected created: Date;
  private PartitionKey: string;
  private SortKey: string;

  protected abstract model: Model | NullModel;

  constructor(properties:{ id?: string, created?: Date }, readonly entityType: EntityType ) {
    let { id, created } = properties;
    this.entityType = entityType;
    this.id = id || v4();
    this.created = created || new Date();
    this.PartitionKey = constructKey(this.entityType, this.id);
    this.SortKey = this.PartitionKey;
  }

  public attributes?(): any

  abstract absolutify(): Entity;
  abstract nullify(): Entity;

  abstract mutableAttributes(): { [k:string]: any };

  /*
   * BEGIN
   * Sync and Unsync functions should be the only functions to work with the model
   * for absolute sub classes, sync should update/insert the entity record in the database
   * for null sub classes, sync should fetch the entity record from the db and return an absolute type of self
   */

  abstract sync(syncOptions:SyncOptions): Promise<Entity>;
  async unsync(): Promise<boolean> {
    try {
      await this.model.delete();
      return true;
    } catch(error) {
      return false;
    }
  }

  /* END */


  get keys() {
    return {
      PK: this.PartitionKey,
      SK: this.SortKey
    } as any;
  }

  public graphqlEntity(): any {
    return null;
  }

}