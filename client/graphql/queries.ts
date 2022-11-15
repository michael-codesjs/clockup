/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getProfile = /* GraphQL */ `
  query GetProfile {
    getProfile {
      ... on User {
        id
        entityType
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
export const getAlarm = /* GraphQL */ `
  query GetAlarm($id: ID!) {
    getAlarm(id: $id) {
      id
      entityType
      created
      modified
      discontinued
      creator
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
  }
`;
