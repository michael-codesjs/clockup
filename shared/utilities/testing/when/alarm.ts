import * as mutations from "@client/graphql/mutations";
import * as types from "@client/types/api";
import { api } from "@lib/amplify";

type Query<T> = Promise<{ data: T }>;

class WhenAlarmUtility {

	private constructor() { }
	static readonly instance = new WhenAlarmUtility();

	async create(input: types.CreateAlarmInput) {

		// updates current authenticated users details via the graphql api

		const response = await (
			api.graphql({
				query: mutations.createAlarm,
				variables: {
					input
				}
			}) as Query<types.CreateAlarmMutation>
		);

		return response.data.createAlarm;

	}

}

export const Alarm = WhenAlarmUtility.instance;