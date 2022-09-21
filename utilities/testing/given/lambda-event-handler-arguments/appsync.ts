import { configureEnviromentVariables } from "@utilities/functions";
import { AppSyncIdentityCognito, AppSyncResolverEvent } from "aws-lambda";
import { context } from "./context";

const { t } = configureEnviromentVariables();

class AppsyncEventsHandlerArguments {

	private constructor() { } // is a singleton
	static readonly instance = new AppsyncEventsHandlerArguments(); // only available instance

	base<Arguments=null>(args: { arguments?: Arguments, identity?: Partial<AppSyncIdentityCognito> }) {

		const { identity } = args;
    type BaseResolverEvent = AppSyncResolverEvent<Arguments>;
    const event: Partial<BaseResolverEvent> = {
    	// will grow with time
    	arguments: args.arguments,
    	identity: identity as AppSyncIdentityCognito
    };
    return {
    	event: event as BaseResolverEvent,
    	context: context()
    };
	}

}

export const appsyncEventsHandlerArguments = AppsyncEventsHandlerArguments.instance;