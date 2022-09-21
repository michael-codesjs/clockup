import { Context } from "aws-lambda";
import { cognitoEventsHandlerArguments } from "./cognito";
import { appsyncEventsHandlerArguments } from "./appsync";

class EventsHandlerArguments {

	private constructor() {}
	static readonly instance = new EventsHandlerArguments();

	context(): Context {
		const context = {};
		return context as Context;
	}

	readonly cognito = cognitoEventsHandlerArguments;
	readonly appsync = appsyncEventsHandlerArguments;
  
}

export const eventHandlerArguments = EventsHandlerArguments.instance;