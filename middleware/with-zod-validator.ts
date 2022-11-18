import { ErrorResponse, ErrorTypes } from "@local-types/api";
import middy from "@middy/core";
import { getErrorResponse } from "@utilities/functions";
import { AppSyncResolverEvent } from "aws-lambda";
import { EntityErrorMessages } from "../framework/entities/types";

/** Returns proper error response when a lambda resolver fails */
export const withErrorResponse = <A, R>(validator:any): middy.MiddlewareObj<AppSyncResolverEvent<{ input: A }>, R> => {

	const before: middy.MiddlewareFn<AppSyncResolverEvent<A>, R | ErrorResponse> = async request => {

    const input

	};

	return {
		onError
	};

};