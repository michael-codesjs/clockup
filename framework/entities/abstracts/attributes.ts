import * as types from "@local-types/api";
import { capitalizeFirstLetter } from "@utilities/functions";
import { ulid } from "ulid";
import { AttributesParams } from "../types";
import { Attribute } from "./attribute";
import { IPutable } from "./interfaces";
import { Publisher } from "./publisher";

export abstract class Attributes extends Publisher implements IPutable {

  protected EntityType: Attribute<types.EntityType, "entityType">;
  protected Id: Attribute<string, "id">;
  protected Created: Attribute<string, "created">; // REVIEW: got a feeling should be readonly, not sure at the moment.
  protected Modified: Attribute<string, "modified">;
  protected Discontinued: Attribute<boolean, "discontinued">;

  private ImmutableAttributes = ["entityType", "id", "modified"] as const; // https://melvingeorge.me/blog/convert-array-into-string-literal-union-type-typescript

  constructor({ entityType, id, created, modified, discontinued }: AttributesParams) {
    super();
    this.EntityType = new Attribute({ required: true, name: "entityType", value: entityType });
    this.Id = new Attribute({ required: true, name: "id", value: id || ulid(), validate: value => value.length > 0 });
    this.Created = new Attribute({ required: true, name: "created", value: created || new Date().toJSON() });
    this.Modified = new Attribute({ name: "modified", value: modified || null });
    this.Discontinued = new Attribute({ name: "discontinued", value: discontinued || false });
  }

  protected isAttributeInThis(attribute: string) {
    const actualAttribute = capitalizeFirstLetter(attribute);
    return actualAttribute in this && this[actualAttribute] instanceof Attribute;
  }

  set(attributes: Partial<Omit<AttributesParams, typeof this.ImmutableAttributes[number]>>) {
    for (let attribute in attributes) {
      if (this.ImmutableAttributes.includes(attribute as any)) continue; // REVIEW: not sure at the moment but can throw an error here or console.warn
      if (this.isAttributeInThis(attribute)) {
        const value = attributes[attribute];
        (this[capitalizeFirstLetter(attribute)] as Attribute).value = value;
      }
    }
    this.Modified.value = new Date().toJSON();
  }

  get(attribute: string) {
    return this.isAttributeInThis(attribute) ? (this[capitalizeFirstLetter(attribute)] as Attribute).value : undefined;
  }

  /**
   * @method
   * @abstract
   * @returns {types.ICommom & Record<string, any>} an entities attributes
   */
  collective(): types.ICommom {
    return {
      entityType: this.EntityType.value,
      id: this.Id.value,
      created: this.Created.value,
      modified: this.Modified.value,
      discontinued: this.Discontinued.value
    }
  }

  putable(): boolean {
    return this.EntityType.putable() && this.Id.putable() && this.Created.putable() && this.Modified.putable();
  }

}