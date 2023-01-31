/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getProfile = /* GraphQL */ `
  query GetProfile {
    getProfile {
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
      }
      ... on ErrorResponse {
        type
        code
        message
        cause
      }
    }
  }
`;
export const getAlarm = /* GraphQL */ `
  query GetAlarm($id: ID!) {
    getAlarm(id: $id) {
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
  }
`;
