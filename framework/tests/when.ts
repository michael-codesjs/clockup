import { PostConfirmationTriggerEvent } from "aws-lambda";
import { api, auth } from "../../lib/amplify";
import { User } from "../types/types"
import * as queries from "../../graphql/queries";
import * as mutations from "../../graphql/mutations";
import { configureEnviromentVariables } from "../../utilities/functions";

configureEnviromentVariables();

export module When {

  export async function userSignIn({ email, password }:{ email: string, password: string }) {
    
    await auth.signIn({
      username: email,
      password
    });

  }

  export async function userSignUp({ name, email, password }:Omit<User, "username">) {

    const { userSub } = await auth.signUp({
      username: email,
      password,
      attributes: {
        name
      }
    });
    
    return {
      name, id: userSub, email
    }

  }

  export function confirmUserSignUp(user:User) {

    const { name, email, username } = user;

    const event: PostConfirmationTriggerEvent = {
      version: "1",
      region: process.env.REGION!,
      userPoolId: process.env.COGNITO_USER_POOL_ID!,
      userName: username,
      triggerSource: "PostConfirmation_ConfirmSignUp",
      request: {
        userAttributes: {
          sub: username,
          "cognito:email_alias": email,
          "cognito:user_status": "CONFIRMED",
          "email_verified": "true",
          name, email
        }
      },
      response: {},
      callerContext: {
        awsSdkVersion: "1",
        clientId: "1",
      }
    };

    return { event };

  }

  export async function getProfile() {

    const response = await api.graphql<User>({
      query: queries.getProfile,
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });

    return response.data.getProfile;

  }

  export async function editUser(args: { [k:string]: any }) {

    const response = await api.graphql<User>(({
      query: mutations.editUser,
      variables: {
        input: {
          ...args
        }
      }
    }));

    return response.data.editUser;

  }

  export async function deleteUser() {

    const response = await api.graphql({
      query: mutations.deleteUser,
      authMode: "AMAZON_COGNITO_USER_POOLS"
    });

    return response.data.deleteUser;

  }


}