import type { AWS } from "../../../../shared/typescript/types/aws";
import { handlerPath } from "../../../../shared/typescript/utilities/functions";
export const preSignUp: AWS.ServerlessLambdaFunction = {
  handler: handlerPath(__dirname) + "/handler.main",
  events: [
    {
      cognitoUserPool: {
        pool: "clock-up-user-pool-${self:custom.stage}",
        existing: true,
        trigger: "PreSignUp"
      }
    }
  ]
}