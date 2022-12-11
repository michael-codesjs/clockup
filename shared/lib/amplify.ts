import { Amplify, Auth, API } from "aws-amplify";
import { configureEnviromentVariables } from "../utilities/functions";

const {
	REGION,
	COGNITO_USER_POOL_ID,
	COGNITO_CLIENT_ID,
	GRAPHQL_API_ENDPOINT
} = configureEnviromentVariables();

Amplify.configure({

	Auth: {
		mandatorySignIn: true,
		region: REGION,
		userPoolId: COGNITO_USER_POOL_ID,
		userPoolWebClientId: COGNITO_CLIENT_ID,
	},

	aws_appsync_graphqlEndpoint: GRAPHQL_API_ENDPOINT,
	aws_appsync_region: REGION,
	aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",

});

export const amplify = Amplify;
export const api = API;
export const auth = Auth;