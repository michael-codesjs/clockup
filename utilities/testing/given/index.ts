import { User } from "./user";

class GivenUtility {
  
	private constructor() {}
	static readonly instance = new GivenUtility();
	
	readonly user = User;

}

export const Given = GivenUtility.instance;