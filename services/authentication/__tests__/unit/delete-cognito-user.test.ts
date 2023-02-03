import { CognitoIdentityServiceProvider } from "aws-sdk";
import { adminCreateUser, adminGetUser } from "../utilities";
import { ServiceIO } from "../../../../shared/typescript/io";
import { chance } from "../../../../shared/typescript/utilities/constants";
import { Repeat } from "../../../../shared/typescript/utilities/testing";

describe("Delete Cognito User", () => {

  let name: string;
  let email: string;
  let user: CognitoIdentityServiceProvider.UserType;

  beforeEach(async () => {

    name = chance.name();
    email = chance.email();

    user = await adminCreateUser({ name, email });

  });

  it("Deletes a cognito user", async () => {

    const payload = { id: user.Username };

    await ServiceIO.authentication.delete({
      payload,
      source: "clockup.authentication.tests.unit.delete-cognito-user"
    });

    const wasDeletedFromCognito = await Repeat.timedOnCondition({
      times: 10,
      duration: 100,
      call: async () => {
        try {
          await adminGetUser(user.Username);
          return false; // adminGetUser is supposed to fail.
        } catch (error: any) {
          return error.code === "UserNotFoundException";
        }
      }
    });

    expect(wasDeletedFromCognito).toBe(true);

  });

});