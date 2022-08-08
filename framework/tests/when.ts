import { AppSyncIdentityCognito, AppSyncResolverEvent, PostConfirmationTriggerEvent } from "aws-lambda";
import { api, auth } from "../../lib/amplify";
import { configureEnviromentVariables } from "../../utilities/functions";
import { User } from "../types/types";
// import { GraphQLResult } from "aws-amplify";

import {
  getProfile as getProfileQuery
} from "../../lib/graphql/queries";

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
      query: getProfileQuery,
      authMode: "AMAZON_COGNITO_USER_POOLS",
    });

    return response.data.getProfile;

  }


}