import { cognitoProvider } from "../../../../shared/typescript/lib/cognito";
import { configureEnviromentVariables } from "../../../../shared/typescript/utilities/functions";

const { COGNITO_USER_POOL_ID } = configureEnviromentVariables();

type Params = {
  email: string,
  name: string,
}

export const adminCreateUser = async (params: Params) => {

  const { email, name } = params;

  const adminCreateUserArgs = {
    Username: email,
    UserAttributes: [
      { Name: "name", Value: name },
      { Name: "email", Value: email }
    ],
    UserPoolId: COGNITO_USER_POOL_ID,
  };

  const { User } = await cognitoProvider()
    .adminCreateUser(adminCreateUserArgs)
    .promise();

  return User;

}