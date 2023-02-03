import { Inputs as UserInputs, GET as GetUserInput } from "../../../shared/typescript/io/types/user";
import { Inputs as RealTimeInputs, ASYNC_OPERATION_RESULT } from "../../../shared/typescript/io/types/real-time";
import { StateMachineEvent } from "../../../shared/typescript/middleware/common-lambda-io/types";
import { generate, resource } from "../../../shared/typescript/utilities";
import { UpdateUserInput as Input } from "../../../shared/typescript/types/api";

/** UpdateUser state machine. */
export const updateUser = {

  name: generate.stateMachineName("UpdateUser"),
  type: "STANDARD",

  loggingConfig: {
    level: "ALL",
    includeExecutionData: true,
    destinations: [
      "${ssm:/clockup/${self:custom.stage}/user/log-groups/update-user/arn}:*"
    ]
  },

  definition: {

    Comment: "",
    StartAt: "ShouldUpdateCognitoUser",
    States: {

      ShouldUpdateCognitoUser: {
        Type: "Choice",
        Choices: [{
          Or: [
            {
              Variable: "$.payload.email",
              IsPresent: true
            },
            {
              Variable: "$.payload.name",
              IsPresent: 30
            }
          ],
          Next: "GetPreUpdateUser"
        }],
        Default: "UpdateUser"
      },

      GetPreUpdateUser: {
        Type: "Task",
        Resource: { "Fn::GetAtt": ["getUser", "Arn"] },
        Parameters: ((): StateMachineEvent<GetUserInput> => ({
          source: "StateMachine",
          attributes: {
            Type: UserInputs.GET,
            ["correlationId.$" as "correlationId"]: "$.correlationId",
          },
          payload: {
            type: UserInputs.GET,
            ["correlationId.$" as "correlationId"]: "$.correlationId",
            payload: {
              ["id.$" as "id"]: "$.payload.id"
            }
          }
        }))(),
        Catch: [{
          ErrorEquals: ["States.ALL"],
          ResultPath: null,
          Next: "Failure"
        }],
        ResultPath: null,
        Next: "NotifyStakeHoldersOfUpdateFailure"
      },

      UpdateCognitoUser: {
        Type: "Task",
        Resource: "arn:aws:states:::sqs:sendMessage.waitForTaskToken",
        Parameters: {
          QueueUrl: resource.authentication.requestQueueURL,
          MessageBody: {
            "taskToken.$": "$$.Task.Token",
            "payload.$": "$.payload",
          },
          MessageAttributes: {
            Type: {
              DataType: "String",
              StringValue: UserInputs.UPDATE
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
          Next: "NotifyStakeHoldersOfUpdateFailure",
          ErrorEquals: ["States.ALL"],
          ResultPath: null,
        }],
        ResultPath: null,
        Next: "UpdateUser"
      },

      UpdateUser: {
        Type: "Task",
        Resource: { "Fn::GetAtt": ["updateUser", "Arn"] },
        Parameters: ((): StateMachineEvent<Input> => ({
          source: "StateMachine",
          attributes: {
            Type: UserInputs.UPDATE,
            ["correlationId.$" as "correlationId"]: "$.correlationId",
          },
          ["payload.$" as "payload"]: "$.payload" as unknown as Input
        }))(),
        Catch: [{
          ErrorEquals: ["States.ALL"],
          ResultPath: null,
          Next: "RollBackUpdateCognitoUser"
        }],
        ResultPath: null,
        Next: "NotifyStakeHoldersOfUpdateSucess"
      },

      RollBackUpdateCognitoUser: {

      },

      NotifyStakeHoldersOfUpdateSucess: {
        Type: "Task",
        Resource: "arn:aws:states:::sns:publish",
        Parameters: {
          TopicArn: resource.realTime.topicArn,
          Message: ((): ASYNC_OPERATION_RESULT => ({
            success: true,
            ["correlationId.$" as "correlationId"]: "$.correlationId",
            title: "User updated successfully.",
            "message": "User details were updated successfully."
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

      NotifyStakeHoldersOfUpdateFailure: {
        Type: "Task",
        Resource: "arn:aws:states:::sqs:sendMessage",
        Parameters: {
          QueueUrl: resource.realTime.requestQueueURL,
          MessageBody: ((): ASYNC_OPERATION_RESULT => ({
            success: true,
            ["correlationId.$" as "correlationId"]: "$.correlationId",
            title: "User update failed.",
            ["message" as "message"]: "Something went wrong while updating user($.payload.id)."
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