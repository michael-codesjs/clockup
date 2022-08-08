/* tslint:disable */
/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getProfile = /* GraphQL */ `
  query GetProfile {
    getProfile {
      id
      entityType
      created
      email
      name
      alarms
    }
  }
`;
export const getAlarm = /* GraphQL */ `
  query GetAlarm($id: ID!) {
    getAlarm(id: $id) {
      id
      created
      name
    }
  }
`;
