import { CreateAlarmInput, UpdateUserInput } from "shared/types/api";
import { AbsoluteUser } from "shared/types/index";
import { Appsync } from "./appsync";


class AlarmHandlerArgumentsUtility {

	private constructor() {}
	static readonly instance = new AlarmHandlerArgumentsUtility();

	create(input: CreateAlarmInput, creator: AbsoluteUser) {
		return Appsync.base({
			identity: {
				sub: creator.attributes.get("id")
			},
			arguments: {
				input
			}
		});
	}

}

export const Alarm = AlarmHandlerArgumentsUtility.instance;