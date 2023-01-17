import { ErrorResponse } from "../abstracts/errors";
import { ErrorResponse as ErrorResponseGraphQLEntity, OperationResponse as OperationResponseGraphQlEntity } from "../types/api";
import { isLiteralArray, isLiteralObject } from "../utilities/functions";

type Outputable<R> = R extends (string | number | boolean) ? OperationResponseGraphQlEntity : R;

/** Runs a supplied function and returns an ErrorResponse graphql entity if that function throws an error. */
export const withOutputResponse = async <R>(call: () => R | Promise<R>): Promise<Outputable<R> | ErrorResponseGraphQLEntity> => {

  let result: Outputable<R> | ErrorResponseGraphQLEntity;

  try {

    result = await call() as Outputable<R>;

    result = isLiteralObject(result) || isLiteralArray(result) ? result : { // turn to OperationResponse if response is not of type object.
      __typename: "OperationResponse",
      success: true,
      message: result
    } as Outputable<R>

  } catch (error: any) {
    result = new ErrorResponse(error).graphQlEntity();
  }

  return result;

}