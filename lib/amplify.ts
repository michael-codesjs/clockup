import { Amplify, Auth, API } from "aws-amplify";
import { configureEnviromentVariables } from "../utilities/functions";

configureEnviromentVariables();

Amplify.configure({

  Auth: {
    mandatorySignIn: true,
    region: process.env.REGION,
    userPoolId: process.env.COGNITO_USER_POOL_ID,
    userPoolWebClientId: process.env.COGNITO_CLIENT_ID,
  },

  aws_appsync_graphqlEndpoint: process.env.GRAPHQL_API_ENDPOINT,
  aws_appsync_region: process.env.REGION,
  aws_appsync_authenticationType: "AMAZON_COGNITO_USER_POOLS",

});

export const amplify = Amplify;
export const api = API;
export const auth = Auth;