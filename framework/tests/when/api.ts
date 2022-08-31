import { api } from "../../../lib/amplify";
import * as queries from "../../../client/graphql/queries";
import * as mutations from "../../../client/graphql/mutations";
import * as types from "../../../client/types/api";

type Query<T> = Promise<{ data: T }>;

export module API {

  export async function getProfile() {
    
    /*
     * get profile query gets the profile of the current authenticated user
     * to get a users profile, you'll have sign them in first
     * Will provide change with time
     */

    const response = await (
      api.graphql({
        query: queries.getProfile,
        authMode: "AMAZON_COGNITO_USER_POOLS",
      }) as Query<types.GetProfileQuery>
    );

    return response.data.getProfile;

  }

  export async function editUser(args: types.UpdateUserInput) {

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

  export async function deleteUser() {

    const response = await (
      api.graphql({
        query: mutations.deleteUser,
        authMode: "AMAZON_COGNITO_USER_POOLS"
      }) as Query<types.DeleteUserMutation>
    );

    return response.data.deleteUser;

  }

}