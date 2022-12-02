import Entities from "@entities";
import { AbsoluteUser } from "@local-types/index";
import middy from "@middy/core";
import { AppSyncIdentityCognito, AppSyncResolverEvent } from "aws-lambda";

export type ArgumentsWithCreator<A extends Record<string, any>> = A & { user: AbsoluteUser };

/** instaciates an absolute user entity and adds to to the event arguments of a lambda resolver */
export const userInstanciator = <A extends Record<string, any>,R>(): middy.MiddlewareObj<AppSyncResolverEvent<ArgumentsWithCreator<A>>, R> => {

	const before: middy.MiddlewareFn<AppSyncResolverEvent<ArgumentsWithCreator<A>>, R> = async request => {
    
		const { sub } = request.event.identity as AppSyncIdentityCognito;
    const user = await Entities.User({ id: sub }).sync();
    request.event.arguments.user = user;
	
	};

	return {
		before
	};

};