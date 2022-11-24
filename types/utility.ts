import { AttributeParams } from "framework/entities/types";
import { AttributeSchema } from "framework/entities/types/attributes";
import { ICommon } from "./api";

export type Replace<T, From, To> = T extends (...args: any[]) => any ? T : {
  [K in keyof T]: [T[K], From] extends [From, T[K]] ? To : Replace<T[K], From, To>
}

export type ChangeTypeOfKeys<T extends object, Keys extends keyof T, NewType> = {
  [key in keyof T]: key extends Keys ? NewType : T[key]
}

export type GraphQlEntity<T> = Omit<T, "__typename">;

export type OmitTypeName<T extends { __typename?: string }> = Omit<T, "__typename">;

export type PutItem<T> = GraphQlEntity<T> & { PK: string, SK: string };
