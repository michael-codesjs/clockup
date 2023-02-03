import { Inputs as UserInputs } from "../../../shared/typescript/io/types/user";
import { Inputs as RealTimeInputs, ASYNC_OPERATION_RESULT } from "../../../shared/typescript/io/types/real-time";
import { StateMachineEvent } from "../../../shared/typescript/middleware/common-lambda-io/types";
import { generate, resource } from "../../../shared/typescript/utilities";

type Input = {
  id: string,
  creator: string,
  creatorType: string
}

/** deleteUser state machine. */
export const deleteUser = {

  name: generate.stateMachineName("DeleteUser"),
  type: "STANDARD",

  loggingConfig: {
    level: "ALL",
    includeExecutionData: true,
    destinations: [
      "${ssm:/clockup/${self:custom.stage}/user/log-groups/delete-user/arn}:*"
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
            Type: UserInputs.DISCONTINUE,
            ["correlationId.$" as "correlationId"]: "$.correlationId",
          },
          ["payload.$" as "payload"]: "$.payload" as unknown as Input
        }))(),
        Catch: [{
          ErrorEquals: ["States.ALL"],
          ResultPath: null,
          Next: "Failure"
        }],
        ResultPath: null,
        Next: "DeleteCognitoUser"
      },

      ContinueUser: {
        Type: "Task",
        Resource: { "Fn::GetAtt": ["continueUser", "Arn"] },
        Parameters: ((): StateMachineEvent<Input> => ({
          source: "StateMachine",
          attributes: {
            Type: UserInputs.CONTINUE,
            ["correlationId.$" as "correlationId"]: "$.correlationId",
          },
          ["payload.$" as "payload"]: "$.payload" as unknown as Input
        }))(),
        ResultPath: null,
        Next: "Failure"
      },

      DeleteCognitoUser: {
        Type: "Task",
        Resource: "arn:aws:states:::sqs:sendMessage.waitForTaskToken",
        Parameters: {
          QueueUrl: resource.authentication.requestQueueURL,
          MessageBody: {
            "id.$": "$.payload.id",
            "taskToken.$": "$$.Task.Token"
          },
          MessageAttributes: {
            Type: {
              DataType: "String",
              StringValue: UserInputs.DELETE
            },
            correlationId: {
              DataType: "String",
              "StringValue.$": "$.correlationId"
            },
            ReplyTo: {
              DataType: "String",
              StringValue: resource.user.responseQueueURL
            }
          }
        },
        Catch: [{
          Next: "ContinueUser",
          ErrorEquals: ["States.ALL"],
          ResultPath: null,
        }],
        ResultPath: null,
        Next: "Success"
      },

      Success: {
        Type: "Task",
        Resource: "arn:aws:states:::sns:publish",
        Parameters: {
          TopicArn: resource.realTime.topicArn,
          Message: ((): ASYNC_OPERATION_RESULT => ({
            success: true,
            ["correlationId.$" as "correlationId"]: "$.correlationId",
            title: "User deleted successfully.",
            ["message" as "message"]: "User($.payload.id) and all their assets were deleted successfully."
          }))(),
          MessageAttributes: {
            Type: {
              DataType: "String",
              StringValue: RealTimeInputs.ASYNC_OPERATION_RESULT
            },
            correlationId: {
              DataType: "String",
              "StringValue.$": "$.correlationId"
            },
          }
        },
        End: true
      },

      Failure: {
        Type: "Task",
        Resource: "arn:aws:states:::sqs:sendMessage",
        Parameters: {
          QueueUrl: resource.realTime.requestQueueURL,
          MessageBody: ((): ASYNC_OPERATION_RESULT => ({
            success: true,
            ["correlationId.$" as "correlationId"]: "$.correlationId",
            title: "User deletion failed.",
            ["message" as "message"]: "Something went wrong while deleting user($.payload.id)."
          }))(),
          MessageAttributes: {
            Type: {
              DataType: "String",
              StringValue: RealTimeInputs.ASYNC_OPERATION_RESULT
            },
            correlationId: {
              DataType: "String",
              "StringValue.$": "$.correlationId"
            },
            Retain: {
              DataType: "String",
              StringValue: "true"
            }
          }
        },
        End: true
      }

    }
  }

};