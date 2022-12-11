import { configureEnviromentVariables } from "@utilities/functions";
import { AppSyncIdentityCognito, AppSyncResolverEvent } from "aws-lambda";
import { context } from "./context";

configureEnviromentVariables();

class AppsyncEventsHandlerArguments {

	private constructor() { }
	static readonly instance = new AppsyncEventsHandlerArguments();

	base<Arguments = null>(args: { arguments?: Arguments, identity?: Partial<AppSyncIdentityCognito> }) {

		const { identity } = args || {};

		type BaseResolverEvent = AppSyncResolverEvent<Arguments>;

		const event: Partial<BaseResolverEvent> = { 
			arguments: args.arguments,
			identity: identity as AppSyncIdentityCognito
		};

		return {
			event: event as BaseResolverEvent,
			context: context()
		};

	}

}

export const Appsync = AppsyncEventsHandlerArguments.instance;