import { StateMachineEvent } from "../../../shared/typescript/middleware/common-lambda-io/types";
import { generate } from "../../../shared/typescript/utilities";

type Input = {
  id: string,
  creator: string,
  creatorType: string
}

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
        Parameters: ((): StateMachineEvent<Input> => ({
          source: "StateMachine",
          attributes: {
            Type: "DELETE",
            ["CID.$" as "CID"]: "$.CID",
          },
          ["payload.$" as "payload"]: "$.payload" as unknown as Array<Input>
        }))(),
        ResultPath: "$",
        End: true
      }
    }
  }

};