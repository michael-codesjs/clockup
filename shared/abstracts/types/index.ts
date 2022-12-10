import { EntityType } from "../../types/api";

export enum EntityErrorMessages {
  ATTEMPT_TO_MUTATE_IMMUTABLE = "Attempting to mutate immutable attribute",
  INSUFFICIENT_ATTRIBUTES_TO_PUT = "Entity requires more attributes for each to be put to the table.",
  CREATABLE_DISCONTINUE_MISSING_CREATOR = "Cannot terminate creatable entity without specifying it's creator",
  NULL_VARIANT_RESTRICTION = "Null variant of entity can not be used to perform operation",
  CREATABLE_BY_CREATOR_NOT_FOUND = "Creatable by user was not found",
  USER_VARIANT_NOT_FOUND = "Could not instanciate variant of from entity group *User*",
  USER_NOT_FOUND = "User not found. Failed to sync NullUser to User",
  ALARM_VARIANT_NOT_FOUND = "Could not instanciate variant of from entity group *Alarm*",
}

export type AttributeParams<T, I> = {
  required?: boolean,
  validate?: (value: T) => boolean,
  value: T,
  immutable?: I
};

export type AttributeSchema<T = any, I extends boolean = false> = {
  type: T,
  immutable: I,
};

export type CommonAttributes = {
  entityType: AttributeSchema<EntityType, true>
  id: AttributeSchema<string, true>,
  created: AttributeSchema<string, true>,
  modified: AttributeSchema<string, true>,
  discontinued: AttributeSchema<boolean, true>
};

export type CreatableAttributes = CommonAttributes & {
  creator: AttributeSchema<string,true>
};

