import { AttributeSchema, CommonAttributes } from "../../../shared/typescript/abstracts/types";
import { EntityType } from "../../../shared/typescript/types/api";

export type UserAttributesSchemaCollection = CommonAttributes & {
  entityType: AttributeSchema<EntityType.User, true>,
  name: AttributeSchema<string>,
  email: AttributeSchema<string>,
  alarms: AttributeSchema<number, true>
};


export type NullStateUserConstructorParams = {
  id: string,
}

export type SemiStateUserConstructorParams = {
  id: string,
  name?: string,
  email?: string
};

export type AbsoluteStateUserConstructorParams = Required<SemiStateUserConstructorParams> &  { id?: string }

export type AllUserConstructorParams = NullStateUserConstructorParams | SemiStateUserConstructorParams | AbsoluteStateUserConstructorParams;