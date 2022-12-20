import { AttributeParams, AttributeSchema, CommonAttributes } from ".";
import { Attribute } from "../attribute";

export type ToAttributeRecord<T extends Record<string, AttributeSchema<any, boolean>>> = {
  [Key in keyof T]: Attribute<T[Key]["type"], T[Key]["immutable"]>
};

export type ToAttributeParams<T extends Record<string, AttributeSchema<any, boolean>>> = {
  [Key in keyof T]: Pick<AttributeParams<T[Key]["type"], T[Key]["immutable"]>, "required" | "validate" | "immutable"> & {
    initial?: T[Key]["type"] | null
  }
};

/** removes keys of ICommon from T*/
export type RefinedToAttributeParams<T extends Record<string, any>> = Omit<ToAttributeParams<T>, keyof CommonAttributes>;

export type EntriesFromAttributesSchema<T extends Record<string, AttributeSchema<any, boolean>>> = {
  [Key in keyof T]: T[Key]["type"]
};

export type GetMutableAttributes<T extends Record<string, AttributeSchema<any, boolean>>> = {
  [Key in keyof T]-?: T[Key]["immutable"] extends false ? Key : never
}[keyof T];

export type GetSetMutableAttributes<T extends Record<string, AttributeSchema<any, boolean>>> = Partial<
  Pick<EntriesFromAttributesSchema<T>, GetMutableAttributes<T>>
>

export type SetsFromAttributeSchema<T extends Record<string, AttributeSchema<any, boolean>>> = {
  [Key in keyof T]-?: T[Key]["type"] extends (object | Array<any>) ? Key : never
}[keyof T];

export type GetSetSetsFromAttributeSchema<T extends Record<string, AttributeSchema<any, boolean>>> = Partial<
  Pick<EntriesFromAttributesSchema<T>, SetsFromAttributeSchema<T>>
>