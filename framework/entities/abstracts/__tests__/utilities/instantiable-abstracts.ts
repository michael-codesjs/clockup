import { EntityType, ICommon } from "@local-types/api";
import { AttributesParams } from "framework/entities/types";
import {
  Entity as AbstractEntity,
  Attributes,
  Keys as AbstractKeys,
  Attribute
} from "../.."

// INSTANTIABLE VERSIONS OF ABSTRACT CLASSES TO BE USED FOR TESTING

type InstatiableAttributes = ICommon & {
  attribute1: string,
  attribute2: string
};

export class Keys extends AbstractKeys {
  configure(): void {

  }
}

export class Entity extends AbstractEntity {

  TypeOfSelf: typeof Entity;
  NullTypeOfSelf: typeof Entity;
  AbsoluteTypeOfSelf: typeof Entity | (typeof Entity)[];

  attributes: Attributes<ICommon> = new Attributes();;
  keys: Keys;

  constructor(params?: { id?: string, entityType?: string }) {
    super(null);
    const { id, entityType } = params || {};
    this.keys = new Keys(this);
  }

  async sync() {
    return this;
  }

}