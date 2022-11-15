import { ErrorResponse, ErrorTypes } from "@local-types/api";
import middy from "@middy/core";
import { getErrorResponse } from "@utilities/functions";
import { AppSyncResolverEvent } from "aws-lambda";

/** Returns proper error response when a lambda resolver fails */
export const withErrorResponse = <A,R>(): middy.MiddlewareObj<AppSyncResolverEvent<A>, R> => {

  const onError: middy.MiddlewareFn<AppSyncResolverEvent<A>, R | ErrorResponse> = async request => {
    const error = request.error;
    request.response = (
      error.name === "ZodError" || "The conditional request failed" ? getErrorResponse(error, ErrorTypes.MalfomedInput) :
      getErrorResponse(error, ErrorTypes.InternalError)
    );
  }

  return {
    onError
  };

}