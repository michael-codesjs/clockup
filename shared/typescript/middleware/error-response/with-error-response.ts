import { ErrorResponse } from "../../abstracts/errors";
import { ErrorResponse as ErrorResponseGraphQLEntity } from "../../types/api";

export const withErrorResponse = async <R>(call: () => R): Promise<R | ErrorResponseGraphQLEntity> => {
  
  let result: R | ErrorResponseGraphQLEntity;
  
  try {
    result = await call();
  } catch (error: any) {
    result = new ErrorResponse(error).graphQlEntity();
  }

  return result;

}