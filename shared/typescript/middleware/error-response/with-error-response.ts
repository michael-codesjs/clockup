import { ErrorResponse } from "../../abstracts/errors";

export const withErrorResponse = async <R>(call: () => R): Promise<(R extends Promise<any> ? Awaited<R> : R) | ReturnType<ErrorResponse["graphQlEntity"]>> => {
  try {
    let result = call();
    if (result instanceof Promise) result = await result;
  } catch (error: any) {
    return new ErrorResponse(error).graphQlEntity();
  }
}