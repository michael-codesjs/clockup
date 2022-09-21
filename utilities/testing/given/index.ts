import { eventHandlerArguments } from "./lambda-event-handler-arguments";
import { User } from "./user";

class GivenUtility {
  
	private constructor() {}
	static readonly instance = new GivenUtility();

	readonly lambdaEventsHandlerArguments = eventHandlerArguments;
	readonly user = User;


}

export const Given = GivenUtility.instance;