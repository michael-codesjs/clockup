import { EntityType, User as TypeUser } from "../../../types/api";
import { Entity } from "../entity";
import { SyncOptions } from "../types";
import { NullUserModel, UserModel } from "./model";


export namespace Users {

  export type UserAttributes = {
    id: string,
    name: string,
    email: string,
    created?: Date,
  };

  export class User extends Entity {

    readonly entityType: EntityType = EntityType.USER;

    readonly TypeOfSelf = User;
    readonly NullTypeOfSelf = NullUser;
    readonly AbsoluteTypeOfSelf = User;

    protected readonly model = new UserModel(this);

    readonly id: string;
    protected created: Date;
    private email: string;
    private name: string;
    private alarms: number;

    constructor(attributes: UserAttributes) {

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
        created: this.created.toJSON(),
        entityType: this.entityType
      };

      return entity

    }

  }

  // NULL USER

  export type NullUserAttributes = { id?: string };

  export class NullUser extends Entity {

    readonly TypeOfSelf = NullUser;
    readonly NullTypeOfSelf = NullUser;
    readonly AbsoluteTypeOfSelf = User;

    protected readonly model = new NullUserModel(this);

    readonly id: string;
    protected created: Date;
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
      return new this.AbsoluteTypeOfSelf({ id: this.id, name: this.name, email: this.email });
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

        return new this.AbsoluteTypeOfSelf({ id: this.id, name: this.name, email: this.email });
      }

      return this

    }

  }

}
