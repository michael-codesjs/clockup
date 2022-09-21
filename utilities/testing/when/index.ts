import { configureEnviromentVariables } from "@utilities/functions";
import { User } from "./user";
import { Authentication } from "./authentication";

configureEnviromentVariables();

export class WhenUtility {

	private constructor() {}
	static readonly instance = new WhenUtility();
  
	readonly user = User;
	readonly auth = Authentication;

}

export const When = WhenUtility.instance;
