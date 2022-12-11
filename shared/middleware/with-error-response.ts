import middy from "@middy/core";
import { AppSyncResolverEvent } from "aws-lambda";
import { ErrorResponse } from "../errors";

/** Returns proper error response when a lambda resolver fails */
export const withErrorResponse = <A, R>(): middy.MiddlewareObj<AppSyncResolverEvent<A>, R> => {

	const onError: middy.MiddlewareFn<AppSyncResolverEvent<A>, R | ErrorResponse> = async request => {
		const error = new ErrorResponse(request.error);
		return error.graphQlEntity();
	};

	return {
		onError
	};

};