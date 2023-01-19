/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const updateUser = /* GraphQL */ `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      ... on User {
        id
        entityType
        creator
        creatorType
        created
        modified
        discontinued
        email
        name
        alarms
      }
      ... on ErrorResponse {
        type
        message
        code
      }
    }
  }
`;
export const deleteUser = /* GraphQL */ `
  mutation DeleteUser {
    deleteUser {
      ... on AsyncOperationResponse {
        status
        cid
      }
      ... on ErrorResponse {
        type
        message
        code
      }
    }
  }
`;
export const createAlarm = /* GraphQL */ `
  mutation CreateAlarm($input: CreateAlarmInput!) {
    createAlarm(input: $input) {
      ... on AlarmResponse {
        alarm {
          id
          entityType
          creator
          creatorType
          created
          modified
          discontinued
          name
          enabled
          days
          time {
            hour
            minute
          }
          snooze {
            duration
            interval
          }
          onceOff
        }
        creator {
          id
          entityType
          creator
          creatorType
          created
          modified
          discontinued
          email
          name
          alarms
        }
      }
      ... on ErrorResponse {
        type
        message
        code
      }
    }
  }
`;
export const updateAlarm = /* GraphQL */ `
  mutation UpdateAlarm($input: UpdateAlarmInput!) {
    updateAlarm(input: $input) {
      ... on AlarmResponse {
        alarm {
          id
          entityType
          creator
          creatorType
          created
          modified
          discontinued
          name
          enabled
          days
          time {
            hour
            minute
          }
          snooze {
            duration
            interval
          }
          onceOff
        }
        creator {
          id
          entityType
          creator
          creatorType
          created
          modified
          discontinued
          email
          name
          alarms
        }
      }
      ... on ErrorResponse {
        type
        message
        code
      }
    }
  }
`;
