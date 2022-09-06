import { Context, PostConfirmationTriggerEvent, AppSyncResolverEvent, AppSyncIdentityCognito } from "aws-lambda";
import { configureEnviromentVariables } from "../../../utilities/functions";
import { Attributes } from "./attributes"

const { COGNITO_USER_POOL_ID, REGION } = configureEnviromentVariables();

type UserAttributes = ReturnType<typeof Attributes.user>;

/*
 * HANDLER:
 * Collection of methods used to obtain arguments for your lambda function handlers.
 * exposed and encouraged to be accessed via the Given static class.
 * @exmaple
 * const userAttributes = Given.attributes?user();
 * const { event, context } = Handler.confirmSignUp(userAttributes);
 * const lambdaResponse = await handler(event,context);
 */

export module Handler {

  export function context() {
    return {} as Context;
  }

  export function confirmSignUp(attributes: Omit<UserAttributes, "password">) {

    const { name, email, username } = attributes;

    const event: PostConfirmationTriggerEvent = {
      version: "1",
      region: REGION!,
      userPoolId: COGNITO_USER_POOL_ID!,
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

    return { event, context: this.context() };

  }

  export function appsync<Arguments = null,>(args: { arguments?: Arguments, identity?: Partial<AppSyncIdentityCognito> }) {

    let { identity } = args;


    type BaseResolverEvent = AppSyncResolverEvent<Arguments>;

    const event: Partial<BaseResolverEvent> = {
      // will grow with time
      arguments: args.arguments,
      identity: identity as AppSyncIdentityCognito
    }

    return {
      event: event as BaseResolverEvent,
      context: this.context
    }
  }

}