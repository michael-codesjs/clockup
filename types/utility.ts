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

export type Enumerate<N extends number, A extends number[] = []> = A['length'] extends N ? A[number] : Enumerate<N, [...A, A['length']]>
export type IntRange<F extends number, T extends number> = Exclude<Enumerate<T>, Enumerate<F>>

export type Spread<T extends Record<string | number | symbol, any>> = {

}