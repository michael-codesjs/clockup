import { ErrorResponse } from "../abstracts/errors";
import { ErrorResponse as ErrorResponseGraphQLEntity, OperationResponse as OperationResponseGraphQlEntity } from "../types/api";
import { isLiteralArray, isLiteralObject } from "../utilities/functions";

type Outputable<R> = R extends (string | number | boolean) ? OperationResponseGraphQlEntity : R;
type GetResponse<R, E extends boolean> = Promise<E extends false ? Outputable<R> | ErrorResponseGraphQLEntity : Outputable<R>>
type Params<E extends boolean> = {
  rethrow: E
}
/** Runs a supplied function and returns an ErrorResponse graphql entity if that function throws an error. */
export const withOutputResponse = async <R, E extends boolean>(call: () => R | Promise<R>, params: Params<E> = { rethrow: false as E }): GetResponse<R, E> => {

  const { rethrow } = params;
  let result: Awaited<GetResponse<R, E>>;

  try {

    result = await call() as Awaited<GetResponse<R, E>>;

    result = isLiteralObject(result) || isLiteralArray(result) ? result : { // turn to OperationResponse if response is not of type object.
      __typename: "OperationResponse",
      success: true,
      message: result
    } as Awaited<GetResponse<R, E>>;

  } catch (error: any) {
    error = new ErrorResponse(error);
    if (rethrow) throw error.graphQlEntity();
    result = error.graphQlEntity() as Awaited<GetResponse<R, E>>;
  }

  return result;

}