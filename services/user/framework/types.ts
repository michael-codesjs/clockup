import { AttributeSchema, CommonAttributes } from "../../../shared/typescript/abstracts/types";
import { EntityType, User as UserGraphQlEntity } from "../../../shared/typescript/types/api";

export type UserAttributesSchemaCollection = CommonAttributes & {
  entityType: AttributeSchema<EntityType.User, true>,
  name: AttributeSchema<string>,
  email: AttributeSchema<string>
};

export type UserDynamoDbItem = Omit<UserGraphQlEntity, "__typename">

export type NullStateUserConstructorParams = {
  id: string,
}

export type SemiStateUserConstructorParams = {
  id: string,
  name?: string,
  email?: string,
};

export type AbsoluteStateUserConstructorParams = Required<SemiStateUserConstructorParams> & { id?: string }

export type AllUserConstructorParams = NullStateUserConstructorParams | SemiStateUserConstructorParams | AbsoluteStateUserConstructorParams;