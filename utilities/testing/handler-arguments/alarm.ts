import { CreateAlarmInput, UpdateUserInput } from "@local-types/api";
import { AbsoluteUser } from "@local-types/index";
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