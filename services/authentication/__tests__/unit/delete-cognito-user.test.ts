import { ServiceIO } from "../../../../shared/typescript/io";
import { cognitoProvider } from "../../../../shared/typescript/lib/cognito";
import { chance } from "../../../../shared/typescript/utilities/constants";
import { configureEnviromentVariables } from "../../../../shared/typescript/utilities/functions";
import { Repeat } from "../../../../shared/typescript/utilities/testing";

const { COGNITO_USER_POOL_ID } = configureEnviromentVariables();

describe("Delete Cognito User", () => {

  let id: string;
  let name: string;
  let email: string;
  let user: any;

  beforeEach(async () => {

    name = chance.name();
    email = chance.email();

    const { User } = await cognitoProvider()
      .adminCreateUser({
        Username: email,
        UserAttributes: [
          { Name: "name", Value: name },
          { Name: "email", Value: email }
        ],
        UserPoolId: COGNITO_USER_POOL_ID,
      })
      .promise();

    user = User;
    id = User.Username;

  });

  it("Deletes a cognito user", async () => {

    await ServiceIO.authentication.delete({ id });

    const wasDeletedFromCognito = await Repeat.timedOnCondition({
      times: 10,
      duration: 100,
      call: async () => {
        try {
          await cognitoProvider()
            .adminGetUser({ UserPoolId: COGNITO_USER_POOL_ID, Username: id })
            .promise();
          return false;
        } catch (error: any) {
          return error.code === "UserNotFoundException";
        }
      }
    });

    expect(wasDeletedFromCognito).toBe(true);

  });

});