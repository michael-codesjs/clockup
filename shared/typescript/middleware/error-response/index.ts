import middy from "@middy/core";
import { ErrorResponse } from "../../abstracts/errors";
import { ErrorResponse as ErrorResponseGraphQLEntity } from "../../types/api";

/** Returns proper error response when a lambda fails */
export const errorResponse = <E, R>(): middy.MiddlewareObj<E, R | ErrorResponseGraphQLEntity> => {


	const onError: middy.MiddlewareFn<E, R | ErrorResponseGraphQLEntity> = async request => {
		const error = new ErrorResponse(request.error);
		return request.response = error.graphQlEntity();
	};

	return {
		onError
	};

};