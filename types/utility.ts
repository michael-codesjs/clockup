import { AttributeParams } from "framework/entities/types";
import { ICommon } from "./api";

export type Replace<T, From, To> = T extends (...args: any[]) => any ? T : {
  [K in keyof T]: [T[K], From] extends [From, T[K]] ? To : Replace<T[K], From, To>
}

export type ChangeTypeOfKeys<T extends object, Keys extends keyof T, NewType> = {
  [key in keyof T]: key extends Keys ? NewType : T[key]
}


export type GraphQlEntity<T> = Omit<T, "__typename">;

export type PutItem<T> = GraphQlEntity<T> & { PK: string, SK: string };

export type ToAttributeParams<T extends Record<string, any>> = {
  [Key in keyof T]: Pick<AttributeParams<T[Key], boolean>, "required" | "validate" | "immutable"> & {
    initial?: T[Key] | null
  }
};

export type RefinedToAttributeParams<T extends Record<string,any>> = Omit<ToAttributeParams<T>, keyof ICommon>