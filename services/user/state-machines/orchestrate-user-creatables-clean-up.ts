import { Inputs, Inputs as UserInputs } from "../../../shared/typescript/io/types/user";
import { Inputs as RealTimeInputs, ASYNC_OPERATION_RESULT } from "../../../shared/typescript/io/types/real-time";
import { StateMachineEvent } from "../../../shared/typescript/middleware/common-lambda-io/types";
import { generate, resource } from "../../../shared/typescript/utilities";

type Input = {
  id: string,
  creator: string,
  creatorType: string
}

/** 'OrchestrateUserCreatablesCleanUp' state machine sls definition. */
export const orchestrateUserCreatablesCleanUp = {

  name: generate.stateMachineName("OrchestrateUserCreatablesCleanUp"),
  type: "STANDARD",
  role: "${ssm:/clockup/${self:custom.stage}/user/roles/orchestrate-user-creatables-clean-up/arn}",

  /* loggingConfig: {
    level: "ALL",
    includeExecutionData: true,
    destinations: [
      "${ssm:/clockup/${self:custom.stage}/user/log-groups/orchestrate-user-creatables-clean-up/arn}:*"
    ]
  }, */

  events: [{
    eventBridge: {
      event: {
        "detail-type": [Inputs.CREATABLES_CLEAN_UP]
      }
    }
  }],

  definition: {

    Comment: "",
    StartAt: "Success",

    States: {

      // MORE STEPS TO COME

      Success: {
        Type: "Task",
        Resource: "arn:aws:states:::events:putEvents",
        Parameters: {
          Entries: [{
            EventBusName: resource.eventBusArn,
            Source: "clockup.user.state-machines.orchestrate-user-creatables-clean-up",
            DetailType: Inputs.CREATABLES_CLEANED_UP,
            Detail: {
              type: Inputs.CREATABLES_CLEANED_UP,
              "corellationId.$": "$.correlationId",
              "meta.$": "$.meta",
              payload: {
                success: true,
                "payload.$": "$.payload"
              }
            }
          }]
        },
        End: true
      }

    }

  }

};