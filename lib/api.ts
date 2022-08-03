/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type User = {
  __typename: "User",
  id?: string | null,
  created?: string | null,
  email?: string | null,
  name?: string | null,
  alarms?: number | null,
};

export type Alarm = {
  __typename: "Alarm",
  id: string,
  created?: string | null,
  name?: string | null,
};

export type GetProfileQuery = {
  getProfile?:  {
    __typename: "User",
    id?: string | null,
    created?: string | null,
    email?: string | null,
    name?: string | null,
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
    created?: string | null,
    name?: string | null,
  } | null,
};
