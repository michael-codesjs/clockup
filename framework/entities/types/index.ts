export type AttributeParams<T, I> = {
  required?: boolean,
  validate?: (value: T) => boolean,
  value: T,
  immutable?: I
};