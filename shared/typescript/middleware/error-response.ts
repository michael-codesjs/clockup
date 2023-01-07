import middy from "@middy/core";
import { AppSyncResolverEvent } from "aws-lambda";
import { ErrorResponse } from "../abstracts/errors";
import { ErrorResponse as ErrorResponseGraphQLEntity } from "../types/api";

/** Returns proper error response when a lambda fails */
export const errorResponse = <A, R>(): middy.MiddlewareObj<AppSyncResolverEvent<A, R>, R> => {

	const onError: middy.MiddlewareFn<AppSyncResolverEvent<A>, R | ErrorResponseGraphQLEntity> = async request => {
		const error = new ErrorResponse(request.error);
		return request.response = error.graphQlEntity();
	};

	return {
		onError
	};

};