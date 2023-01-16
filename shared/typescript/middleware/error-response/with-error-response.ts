import { ErrorResponse } from "../../abstracts/errors";
import { ErrorResponse as ErrorResponseGraphQLEntity } from "../../types/api";

/** Runs a supplied function and returns an ErrorResponse graphql entity if that function throws an error. */
export const withErrorResponse = async <R>(call: () => R): Promise<R | ErrorResponseGraphQLEntity> => {
  
  let result: R | ErrorResponseGraphQLEntity;
  
  try {
    result = await call();
  } catch (error: any) {
    result = new ErrorResponse(error).graphQlEntity();
  }

  return result;

}