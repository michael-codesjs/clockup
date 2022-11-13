import { EntityType } from "@local-types/api";
import {
  Entity as AbstractEntity,
  Attributes as AbstractAttributes,
  Keys as AbstractKeys
} from "../.."

// INSTANTIABLE VERSIONS OF ABSTRACT CLASSES TO BE USED FOR TESTING

export class Attributes extends AbstractAttributes { }

export class Keys extends AbstractKeys {
  configure(): void {

  }
}

export class Entity extends AbstractEntity {

  TypeOfSelf: typeof Entity;
  NullTypeOfSelf: typeof Entity;
  AbsoluteTypeOfSelf: typeof Entity | (typeof Entity)[];

  attributes: Attributes;
  keys: Keys;

  constructor(params?: { id?: string, entityType?: string }) {
    super(null);
    const { id, entityType } = params || {};
    this.attributes = new Attributes({ entityType: (entityType || "Entity") as EntityType, id });
  }

  async sync() {
    return this;
  }

}