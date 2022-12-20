import { configureEnviromentVariables } from "../../../utilities/functions";
import { PostConfirmationTriggerEvent } from "aws-lambda";
import { context } from "./context";

const { COGNITO_USER_POOL_ID, REGION } = configureEnviromentVariables();

class CognitoEventsHandlerArguments {

	private constructor() { } // is a singleton
	static readonly instance = new CognitoEventsHandlerArguments();

	confirmSignUp(attributes: { name: string, email: string, id: string }) {

		const { name, email, id } = attributes;

		const event: PostConfirmationTriggerEvent = {
			version: "1",
			region: REGION!,
			userPoolId: COGNITO_USER_POOL_ID!,
			userName: id,
			triggerSource: "PostConfirmation_ConfirmSignUp",
			request: {
				userAttributes: {
					sub: id,
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

		return { event, context: context() };

	}

}

export const Cognito = CognitoEventsHandlerArguments.instance;