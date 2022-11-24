import { EntityType } from "@local-types/api";

export type AttributeSchema<T = any, I extends boolean = false> = {
  type: T,
  immutable: I,
};

export type ICommon = {
  entityType: AttributeSchema<EntityType, true>
  id: AttributeSchema<string, true>,
  created: AttributeSchema<string, true>,
  modified: AttributeSchema<string, true>
  discontinued: AttributeSchema<boolean, true>
};