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
      entityType
      created
      name
      enabled
      modified
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
export const getImageUploadURL = /* GraphQL */ `
  query GetImageUploadURL($contentType: String, $extension: String) {
    getImageUploadURL(contentType: $contentType, extension: $extension)
  }
`;
