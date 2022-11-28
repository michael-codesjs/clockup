import { EntityType } from "@local-types/api";

export type AttributeSchema<T = any, I extends boolean = false> = {
  type: T,
  immutable: I,
};

// ENTITY ATTRIBUTE SCHEMAS

export type ICommon = {
  entityType: AttributeSchema<EntityType, true>
  id: AttributeSchema<string, true>,
  created: AttributeSchema<string, true>,
  modified: AttributeSchema<string, true>
  discontinued: AttributeSchema<boolean, true>
};

export type Creatable = ICommon & {
  creator: AttributeSchema<string,true>
};

export type User = ICommon & {
  name: AttributeSchema<string>,
  email: AttributeSchema<string>,
  alarms: AttributeSchema<number, true>
};