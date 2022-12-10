import Entities from "@entities";
import { AbsoluteUser } from "shared/types/index";
import middy from "@middy/core";
import { AppSyncIdentityCognito, AppSyncResolverEvent } from "aws-lambda";

export type ArgumentsWithCreator<A extends Record<string, any>> = A & { user: AbsoluteUser };

/**
 * Instaciates an absolute user entity and adds it to the event arguments of a lambda resolver.
 * Remember to supply dynamodb:GetItem permissions on the table to the lambda functions using this middleware.
 */
export const userInstanciator = <A extends Record<string, any>,R>(): middy.MiddlewareObj<AppSyncResolverEvent<ArgumentsWithCreator<A>>, R> => {

	const before: middy.MiddlewareFn<AppSyncResolverEvent<ArgumentsWithCreator<A>>, R> = async request => {    
		const { sub } = request.event.identity as AppSyncIdentityCognito; // sub === userId
    const user = await Entities.User({ id: sub }).sync(); // get UserEntityGroup.User from UserEntityGroup.NullUser.sync
    request.event.arguments.user = user; // add user to event arguments to be used by lambda
	};

	return {
		before
	};

};