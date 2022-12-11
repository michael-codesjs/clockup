import { configureEnviromentVariables } from "../../functions";
// import { User } from "./user";
// import { Authentication } from "./authentication";
// import { Alarm } from "./alarm";

configureEnviromentVariables();

export class WhenUtility {

	private constructor() {}
	static readonly instance = new WhenUtility();
  
	// readonly user = User;
	// readonly auth = Authentication;
	// readonly alarm = Alarm;

}

export const When = WhenUtility.instance;
