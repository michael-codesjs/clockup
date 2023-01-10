/** deleteUser state machine. */
export const deleteUser = {
  name: "ClockUpDeleteUser(${self:custom.stage})",
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