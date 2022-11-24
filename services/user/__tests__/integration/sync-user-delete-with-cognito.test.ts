import Entities from "@entities";
import { cognitoProvider } from "@lib/cognito";
import { configureEnviromentVariables, delay } from "@utilities/functions";
import { Given } from "@utilities/testing";
import { Repeat } from "@utilities/testing/repeat";

const { COGNITO_USER_POOL_ID } = configureEnviromentVariables();

describe("Sync User Delete", () => {

  const userDoesNotExist = async (id:string) => {
    try {
      await cognitoProvider()
        .adminGetUser({
          Username: id,
          UserPoolId: COGNITO_USER_POOL_ID
        })
        .promise();
      return false; // false cause user was fetched successfully
    } catch (error: any) {
      return error.message === "User does not exist.";
    } 
  }

  test("User was deleted from cognito", async () => {

    const user = await Given.user.authenticated();
    expect(await userDoesNotExist(user.id)).toBe(false);

    
    const instance = Entities.User(user);
    await instance.terminate(); // delete user in dynamodb

    const result = await Repeat.timedOnCondition({
      times: 10, // repeat 10 times until we get true from 'call'
      duration: 100, // check every 100ms
      call: async () => await userDoesNotExist(instance.attributes.get("id"))
    });

    expect(result).toBe(true);

  });

});