/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type UpdateUserInput = {
  email?: string | null,
  name?: string | null,
};

export type User = {
  __typename: "User",
  id: string,
  entityType: EntityType,
  created: string,
  email: string,
  name: string,
};

export type ICommom = {
  __typename: "ICommom",
  id: string,
  entityType?: EntityType | null,
  created?: string | null,
};

export type Alarm = {
  __typename: "Alarm",
  id: string,
  entityType: EntityType,
  created: string,
  name?: string | null,
  enabled?: boolean | null,
  modified?: string | null,
  days?: Array< number > | null,
  time: AlarmRingTime,
  snooze: AlarmSnoozeSettings,
  onceOff?: boolean | null,
};

export enum EntityType {
  USER = "USER",
  ALARM = "ALARM",
}


export type AlarmRingTime = {
  __typename: "AlarmRingTime",
  hour: number,
  minute: number,
};

export type AlarmSnoozeSettings = {
  __typename: "AlarmSnoozeSettings",
  duration: number,
  interval: number,
};

export type EditUserMutationVariables = {
  input?: UpdateUserInput | null,
};

export type EditUserMutation = {
  editUser?:  {
    __typename: "User",
    id: string,
    entityType: EntityType,
    created: string,
    email: string,
    name: string,
    alarms: number,
  } | null,
};

export type DeleteUserMutation = {
  deleteUser?: boolean | null,
};

export type GetProfileQuery = {
  getProfile?:  {
    __typename: "User",
    id: string,
    entityType: EntityType,
    created: string,
    email: string,
    name: string,
    alarms: number,
  } | null,
};

export type GetAlarmQueryVariables = {
  id: string,
};

export type GetAlarmQuery = {
  getAlarm?:  {
    __typename: "Alarm",
    id: string,
    entityType: EntityType,
    created: string,
    name?: string | null,
    enabled?: boolean | null,
    modified?: string | null,
    days?: Array< number > | null,
    time:  {
      __typename: "AlarmRingTime",
      hour: number,
      minute: number,
    },
    snooze:  {
      __typename: "AlarmSnoozeSettings",
      duration: number,
      interval: number,
    },
    onceOff?: boolean | null,
  } | null,
};

export type GetImageUploadURLQueryVariables = {
  contentType?: string | null,
  extension?: string | null,
};

export type GetImageUploadURLQuery = {
  getImageUploadURL?: string | null,
};
