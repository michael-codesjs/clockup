import { cognitoProvider } from "../../../../shared/typescript/lib/cognito";
import { configureEnviromentVariables } from "../../../../shared/typescript/utilities/functions";
import { Given, Repeat } from "../../../../shared/typescript/utilities/testing";

export const wasUserDeletedFromCognitoUserPool = async (id: string, params = { times: 20, duration: 500 }) => await Repeat.timedOnCondition({
  times: params.times,
  duration: params.duration,
  call: async () => {
    try {
      await Given.user.cognito(id);
      return false; // we expect Given.user.cognito to fail and throw and exception.
    } catch (error: any) {
      return error.code === "UserNotFoundException";
    }
  }
})