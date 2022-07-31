
export type Replace<T, From, To> = T extends (...args: any[]) => any ? T : {
  [K in keyof T]: [T[K], From] extends [From, T[K]] ? To : Replace<T[K], From, To>
}

export type ChangeTypeOfKeys<T extends object, Keys extends keyof T, NewType> = {
  [key in keyof T]: key extends Keys ? NewType : T[key]
}
