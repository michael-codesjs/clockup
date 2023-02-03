export type CommonInput<T, P> = {
  /** typeof of input. */
  type: T,
  /** correlation id. */
  correlationId: string,
  /** consumer specific meta data. */
  meta?: Record<string, any>,
  /** input payload. */
  payload: P
};

export type SendInputResponse<R extends Record<string,any>> = {
  correlationId: string,
  response: Record<string, any>
};