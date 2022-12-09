import { ErrorResponse, ErrorTypes } from "shared/types/api";
import middy from "@middy/core";
import { getErrorResponse } from "@utilities/functions";
import { AppSyncResolverEvent } from "aws-lambda";
import { EntityErrorMessages } from "../framework/entities/types";

/** Returns proper error response when a lambda resolver fails */
export const withErrorResponse = <A, R>(): middy.MiddlewareObj<AppSyncResolverEvent<A>, R> => {

	const onError: middy.MiddlewareFn<AppSyncResolverEvent<A>, R | ErrorResponse> = async request => {

		const error = request.error;

		request.response = (
			error.name === "ValidationError" || error.message === "The conditional request failed" ? getErrorResponse(error, ErrorTypes.MalfomedInput) :
				error.message === EntityErrorMessages.USER_NOT_FOUND || error.message === "User does not exist." ? getErrorResponse(error, ErrorTypes.NotFound) :
					getErrorResponse(error, ErrorTypes.InternalError)
		);

	};

	return {
		onError
	};

};