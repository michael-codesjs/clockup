import { api } from "../../../lib/amplify";
import * as queries from "../../../client/graphql/queries";
import * as mutations from "../../../client/graphql/mutations";
import * as types from "../../../client/types/api";

type Query<T> = Promise<{ data: T }>;

class WhenUserUtility {

	private constructor() {}
	static readonly instance = new WhenUserUtility();

	async get() {

		const response = await (
      api.graphql({
      	query: queries.getProfile,
      	authMode: "AMAZON_COGNITO_USER_POOLS",
      }) as Query<types.GetProfileQuery>
		);

		return response.data.getProfile;

	}

	async edit(args: types.UpdateUserInput) {

		const response = await (
      api.graphql({
      	query: mutations.editUser,
      	variables: {
      		input: { ...args }
      	}
      }) as Query<types.EditUserMutation>
		);

		return response.data.editUser;

	}

	async delete() {

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