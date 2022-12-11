import { CognitoIdentityServiceProvider } from "aws-sdk";
import { configureEnviromentVariables } from "../utilities/functions";

const { REGION } = configureEnviromentVariables();

export const cognitoProvider = () => new CognitoIdentityServiceProvider({ region: REGION });