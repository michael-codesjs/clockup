import { cognitoProvider } from "../../../../shared/typescript/lib/cognito";
import { configureEnviromentVariables } from "../../../../shared/typescript/utilities/functions";

const { COGNITO_USER_POOL_ID } = configureEnviromentVariables();

export const adminGetUser = async (id: string) => (
  await cognitoProvider()
    .adminGetUser({ UserPoolId: COGNITO_USER_POOL_ID, Username: id })
    .promise()
);