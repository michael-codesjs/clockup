import { UpdateUserInput } from "shared/types/api";
import { Appsync } from "./appsync";


class UserHandlerArgumentsUtility {

	private constructor() {}
	static readonly instance = new UserHandlerArgumentsUtility();

	readonly delete = this.get; // same as get payload

	get(id:string) {

		// returns lambda payload for the get-user handler

		return Appsync.base({
			identity: {
				sub: id
			}
		});

	}

	update(params: { id: string } & UpdateUserInput) {

		const { id, name, email } = params;

		return Appsync.base({
			identity: {
				sub: id
			},
			arguments: {
				input: {
					name, email
				}
			}
		});

	}


}

export const User = UserHandlerArgumentsUtility.instance;