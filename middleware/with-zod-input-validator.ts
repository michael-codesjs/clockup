import { ErrorResponse } from "@local-types/api";
import middy from "@middy/core";
import { AppSyncResolverEvent } from "aws-lambda";
import { ZodObject, ZodType } from "zod";

type Properties<T> = Required<{
	[K in keyof T]: ZodType<T[K], any, T[K]>;
}>;

/** validates inputs before passing them on to lambdas */
export const withZodInputValidator = <A extends { input: Record<string, any> }, R>(validator: () => ZodObject<Properties<A["input"]>>): middy.MiddlewareObj<AppSyncResolverEvent<A>, R> => {

	const before: middy.MiddlewareFn<AppSyncResolverEvent<A>, R | ErrorResponse> = async request => {
		request.event.arguments.input = validator().parse(request.event.arguments.input);
	};

	return {
		before
	};
}