import { CognitoIdentityServiceProvider } from "aws-sdk";
import { ServiceIO } from "../../../../shared/typescript/io";
import { Given, Repeat } from "../../../../shared/typescript/utilities/testing";
import { adminCreateUser, adminGetUser } from "../utilities";

describe("Update Cognito User Attributes", () => {

  let user: CognitoIdentityServiceProvider.UserType;

  beforeEach(async () => {
    const cognitoAttributes = Given.user.cognitoAttributes();
    user = await adminCreateUser(cognitoAttributes);
  });

  it("Updates a cognito users attributes", async () => {

    const cognitoAttributes = Given.user.cognitoAttributes();
    const payload = { id: user.Username, ...cognitoAttributes };

    await ServiceIO.authentication.update({
      payload,
      source: "clockup.authentication.tests.unit.update-cognito-user"
    });

    const wasUserUpdated = await Repeat.timedOnCondition({

      times: 10,
      duration: 100,

      call: async () => {

        const { Username } = user;

        const postUpdateCognitoUser = await adminGetUser(Username);

        const parsedAttributes = postUpdateCognitoUser.UserAttributes.reduce((cumulative, current) => {
          cumulative[current.Name] = current.Value;
          return cumulative;
        }, {} as Record<string, any>);

        expect(parsedAttributes).toMatchObject(cognitoAttributes);

        return true;

      }
    });

    expect(wasUserUpdated).toBe(true);

  });

});