import { cognitoProvider } from "../../../../shared/typescript/lib/cognito";
import { configureEnviromentVariables } from "../../../../shared/typescript/utilities/functions";
import { Given, Repeat } from "../../../../shared/typescript/utilities/testing";

const { COGNITO_USER_POOL_ID } = configureEnviromentVariables();

export const wasUserDeleted = async (id: string, params = { times: 20, duration: 500 }) => await Repeat.timedOnCondition({
  times: params.times,
  duration: params.duration,
  call: async () => {
    const postDeleteDbRecord = await Given.user.byId(id);
    if(postDeleteDbRecord.discontinued === false) return false;
    try {
      await cognitoProvider()
        .adminGetUser({
          Username: id,
          UserPoolId: COGNITO_USER_POOL_ID
        })
        .promise();
      throw new Error("User was not deleted from cognito.");
    } catch (error: any) {
      return error.code === "UserNotFoundException";
    }
  }
})