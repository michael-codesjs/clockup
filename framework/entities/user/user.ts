import { IEntityFactory } from "@local-types/interfaces";
import { EntityType, User as TypeUser } from "../../../types/api";
import { Entity } from "../entity";
import { AbsoluteUserAttributes, NullUserAttributes, SyncOptions } from "../types";
import { NullUserModel, UserModel } from "./model";

namespace UserEntityGroup {
  
  export interface IUser {

  }

  /* ABSOLUTE USER (positive) */

  export class User extends Entity implements IUser {

    readonly entityType: EntityType = EntityType.USER;

    readonly TypeOfSelf = User;
    readonly NullTypeOfSelf = NullUser;
    readonly AbsoluteTypeOfSelf = User;

    protected readonly model = new UserModel(this);

    readonly id: string;
    protected created: string; // Date.toJSON();
    private email: string;
    private name: string;
    private alarms: number;

    constructor(attributes: AbsoluteUserAttributes & { created?: string }) {

      let { id, created, email, name } = attributes;

      super({ id, created }, EntityType.USER);

      this.email = email;
      this.name = name;
      this.alarms = 0;

    }

    absolutify(): Entity {
      return this;
    }

    nullify(): Entity {
      return new this.NullTypeOfSelf({ id: this.id });
    }

    mutableAttributes() {
      return {
        name: this.name,
        email: this.email
      }
    }

    async sync(options: SyncOptions = { exists: true }) {

      const { exists } = options;
      const attributes = exists ? await this.model.mutate() : await this.model.put(); // update/create the entity in the db table depending on whether they exist or not

      Object.entries(attributes).forEach(([attribute, value]) => {
        // update entity with updated values;
        this[attribute] = value;
      });

      return this;

    }

    public graphqlEntity() {

      const entity: Omit<TypeUser, "__typename"> = {
        id: this.id,
        name: this.name,
        email: this.email,
        alarms: this.alarms,
        created: this.created,
        entityType: this.entityType
      };

      return entity

    }

  }

  /* NULL USER (negative) */

  export class NullUser extends Entity implements IUser {

    readonly TypeOfSelf = NullUser;
    readonly NullTypeOfSelf = NullUser;
    readonly AbsoluteTypeOfSelf = User;

    protected readonly model = new NullUserModel(this);

    readonly id: string;
    protected created: string;
    protected email: string;
    protected name: string;
    protected alarms: number;

    constructor(properties?: NullUserAttributes) {

      let { id } = properties || {};
      id = id || "";

      super({ id }, EntityType.USER);

      this.email = "";
      this.name = "";
      this.alarms = 0;

    }

    absolutify(): Entity {
      return new this.AbsoluteTypeOfSelf({
        id: this.id,
        name: this.name,
        email: this.email,
        created: this.created
      });
    }

    nullify(): Entity {
      return this;
    }

    mutableAttributes(): { [k: string]: any; } {
      return {
        name: this.name,
        email: this.email
      }
    }

    async sync() {

      const { Item } = await this.model.get(); // get attributes if user exists;

      let keys: string[];
      if (Item && (keys = Object.keys(Item)) && keys.length > 1) { // we actually got something

        keys.forEach(attribute => {
          this[attribute] = Item[attribute];
        });

        return this.absolutify();
      }

      return this

    }

  }

}


/* USER FACTORY */

type Attributes = AbsoluteUserAttributes | NullUserAttributes;
type UserVariant<T> = T extends AbsoluteUserAttributes ? UserEntityGroup.User : T extends NullUserAttributes ? UserEntityGroup.NullUser : never;

class Factory implements IEntityFactory {

  createEntity<T extends Attributes>(args: T): UserVariant<T> {

     // returns a type/state of user depending on what data you provide.
    
     let instance:Entity;

     if(args && "name" in args && "email" in args) {

       instance = new UserEntityGroup.User(args);
     
      } else {
      
        instance = new UserEntityGroup.NullUser(args);
     
      }
 
    return instance as UserVariant<T>;

  }

}

const UserFactory = new Factory();

export default UserFactory
