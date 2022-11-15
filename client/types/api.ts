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
  modified?: string | null,
  discontinued: boolean,
  email: string,
  name: string,
  alarms?: number | null,
};

export type ICommon = {
  __typename: "ICommon",
  id: string,
  entityType: EntityType,
  created: string,
  modified?: string | null,
  discontinued: boolean,
};

export type Alarm = {
  __typename: "Alarm",
  id: string,
  entityType: EntityType,
  created: string,
  modified?: string | null,
  discontinued: boolean,
  creator: string,
  name?: string | null,
  enabled?: boolean | null,
  days?: Array< number > | null,
  time: AlarmRingTime,
  snooze: AlarmSnoozeSettings,
  onceOff?: boolean | null,
};

export type ICreatable = {
  __typename: "ICreatable",
  creator: string,
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

export type UpsertAlarmInput = {
  id?: string | null,
  name?: string | null,
  enabled?: boolean | null,
  days?: Array< number > | null,
  time: AlarmRingTimeInput,
  snooze: AlarmSnoozeSettingsInput,
  onceOff?: boolean | null,
};

export type AlarmRingTimeInput = {
  hour: number,
  minute: number,
};

export type AlarmSnoozeSettingsInput = {
  duration: number,
  interval: number,
};

export type UpdateUserMutationVariables = {
  input?: UpdateUserInput | null,
};

export type UpdateUserMutation = {
  updateUser?:  {
    __typename: "User",
    id: string,
    entityType: EntityType,
    created: string,
    modified?: string | null,
    discontinued: boolean,
    email: string,
    name: string,
    alarms?: number | null,
  } | null,
};

export type DeleteUserMutation = {
  deleteUser?: boolean | null,
};

export type UpsertAlarmMutationVariables = {
  input: UpsertAlarmInput,
};

export type UpsertAlarmMutation = {
  upsertAlarm?:  {
    __typename: "Alarm",
    id: string,
    entityType: EntityType,
    created: string,
    modified?: string | null,
    discontinued: boolean,
    creator: string,
    name?: string | null,
    enabled?: boolean | null,
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

export type GetProfileQuery = {
  getProfile?:  {
    __typename: "User",
    id: string,
    entityType: EntityType,
    created: string,
    modified?: string | null,
    discontinued: boolean,
    email: string,
    name: string,
    alarms?: number | null,
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
    modified?: string | null,
    discontinued: boolean,
    creator: string,
    name?: string | null,
    enabled?: boolean | null,
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
