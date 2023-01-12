import { generate } from "../../../shared/typescript/utilities";

/** deleteUser state machine. */
export const deleteUser = {
  name: generate.stateMachineName("DeleteUser"),
  events: [
    /*
      {
        http: {
          path: "delete",
          method: "GET"
        }
      }
    */
  ],
  definition: {
    Comment: "",
    StartAt: "DiscontinueUser",
    States: {
      DiscontinueUser: {
        Type: "Task",
        Resource: { "Fn::GetAtt": ["discontinueUser", "Arn"] },
        End: true
      }
    }
  }

};