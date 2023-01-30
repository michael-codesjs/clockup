import { config } from "aws-sdk";
import { createSignedFetcher } from 'aws-sigv4-fetch';
import { configureEnviromentVariables } from '../utilities/functions';

const { REGION } = configureEnviromentVariables();

export const apiGatewaySignedFetch = createSignedFetcher({
  service: "execute-api",
  region: REGION,
  credentials: config.credentials
});