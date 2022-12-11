import middy from "@middy/core";
import { AppSyncResolverEvent } from "aws-lambda";
import { SchemaOf } from "yup";

/** validates input arguments sent to resolvers */
export const yupInputValidator = <A extends { input: Record<string, any> }, R>(validator: () => SchemaOf<A["input"]>): middy.MiddlewareObj<AppSyncResolverEvent<A>, R> => {

	const before: middy.MiddlewareFn<AppSyncResolverEvent<A>, R> = async request => {
		request.event.arguments.input = await validator().validate(request.event.arguments.input);
	};

	return {
		before
	};

};