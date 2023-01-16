import { generate } from "../../../shared/typescript/utilities";

/** deleteUser state machine. */
export const deleteUser = {
  name: generate.stateMachineName("DeleteUser"),
  type: "EXPRESS",
  loggingConfig: {
    level: "ALL",
    includeExecutionData: true,
    destinations: [
      "${ssm:/clock-up/${self:custom.stage}/user/log-groups/delete-user/arn}:*"
    ]
  },
  definition: {
    Comment: "",
    StartAt: "DiscontinueUser",
    States: {
      DiscontinueUser: {
        Type: "Task",
        Resource: { "Fn::GetAtt": ["discontinueUser", "Arn"] },
        ResultPath: "$",
        End: true
      }
    }
  }

};