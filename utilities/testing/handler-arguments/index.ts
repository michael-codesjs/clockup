import { Context } from "aws-lambda";
import { Cognito } from "./cognito";
import { Appsync } from "./appsync";
import { User } from "./user";

class HandlerArgumentsUtility {

	private constructor() {}
	static readonly instance = new HandlerArgumentsUtility();

	readonly cognito = Cognito;
	readonly appsync = Appsync;
	readonly user = User
  
}

export const HandlerArguments = HandlerArgumentsUtility.instance;