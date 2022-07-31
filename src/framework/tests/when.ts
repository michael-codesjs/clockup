import { CognitoIdentityServiceProvider } from "aws-sdk";
import { PostConfirmationTriggerEvent } from "aws-lambda";
import { User } from "../types/types";
import { configureEnviromentVariables } from "../../utilities/functions";

configureEnviromentVariables();

export abstract class When {

  static async userSignUp({ name, email, password }:Omit<User, "username">) {

    const cognito = new CognitoIdentityServiceProvider();

    const userPoolId = process.env.COGNITO_USER_POOL_ID!;
    const clientId = process.env.COGNITO_CLIENT_ID!;

    const signUpResponse = await cognito.signUp({
      ClientId: clientId,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: "name", Value: name }
      ]
    }).promise();

    const username = signUpResponse.UserSub;


    await cognito.adminConfirmSignUp({
      UserPoolId: userPoolId,
      Username: username,
    }).promise();

    return {
      name, username, email
    }

  }

  static confirmUserSignUp(user:User) {

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


}