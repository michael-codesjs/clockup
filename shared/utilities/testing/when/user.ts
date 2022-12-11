import { api } from "@lib/amplify";
import * as queries from "@client/graphql/queries";
import * as mutations from "@client/graphql/mutations";
import * as types from "@client/types/api";

type Query<T> = Promise<{ data: T }>;

class WhenUserUtility {

	private constructor() { }
	static readonly instance = new WhenUserUtility();

	async get() {

		// gets current authenticated users profile via the graphql api

		const response = await (
			api.graphql({
				query: queries.getProfile,
				authMode: "AMAZON_COGNITO_USER_POOLS",
			}) as Query<types.GetProfileQuery>
		);

		return response.data.getProfile;

	}

	async update(args: types.UpdateUserInput) {

		// updates current authenticated users details via the graphql api

		const response = await (
			api.graphql({
				query: mutations.updateUser,
				variables: {
					input: { ...args }
				}
			}) as Query<types.UpdateUserMutation>
		);

		return response.data.updateUser;

	}

	async delete() {

		// deletes the current authenticated user via the graphql api

		const response = await (
			api.graphql({
				query: mutations.deleteUser,
				authMode: "AMAZON_COGNITO_USER_POOLS"
			}) as Query<types.DeleteUserMutation>
		);

		return response.data.deleteUser;

	}

}

export const User = WhenUserUtility.instance;