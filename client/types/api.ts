/* tslint:disable */
/* eslint-disable */
//  This file was automatically generated and should not be edited.

export type UpdateUserInput = {
  email?: string | null,
  name?: string | null,
};

export type UserOutput = User | ErrorResponse


export type User = {
  __typename: "User",
  id: string,
  entityType: EntityType,
  created: string,
  modified?: string | null,
  discontinued: boolean,
  email: string,
  name: string,
  alarms: number,
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

export type ErrorResponse = {
  __typename: "ErrorResponse",
  type: ErrorTypes,
  message?: string | null,
  code?: number | null,
};

export enum ErrorTypes {
  NOT_FOUND = "NOT_FOUND",
  MALFOMED_INPUT = "MALFOMED_INPUT",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  CREATE_FAILED = "CREATE_FAILED",
  UPDATE_FAILED = "UPDATE_FAILED",
}


export type OperationOutput = OperationResponse | ErrorResponse


export type OperationResponse = {
  __typename: "OperationResponse",
  success: boolean,
  message?: string | null,
};

export type CreateAlarmInput = {
  name?: string | null,
  enabled?: boolean | null,
  days?: Array< number > | null,
  time: AlarmRingTimeInput,
  snooze: AlarmSnoozeSettingsInput,
  onceOff?: boolean | null,
};

export type AlarmRingTimeInput = {
  hour?: number | null,
  minute?: number | null,
};

export type AlarmSnoozeSettingsInput = {
  duration?: number | null,
  interval?: number | null,
};

export type UpdateAlarmInput = {
  id: string,
  name?: string | null,
  enabled?: boolean | null,
  days?: Array< number > | null,
  time?: AlarmRingTimeInput | null,
  snooze?: AlarmSnoozeSettingsInput | null,
  onceOff?: boolean | null,
};

export type UpdateUserMutationVariables = {
  input: UpdateUserInput,
};

export type UpdateUserMutation = {
  updateUser: ( {
      __typename: "User",
      id: string,
      entityType: EntityType,
      created: string,
      modified?: string | null,
      discontinued: boolean,
      email: string,
      name: string,
      alarms: number,
    } | {
      __typename: "ErrorResponse",
      type: ErrorTypes,
      message?: string | null,
      code?: number | null,
    }
  ) | null,
};

export type DeleteUserMutation = {
  deleteUser: ( {
      __typename: "OperationResponse",
      success: boolean,
      message?: string | null,
    } | {
      __typename: "ErrorResponse",
      type: ErrorTypes,
      message?: string | null,
      code?: number | null,
    }
  ) | null,
};

export type CreateAlarmMutationVariables = {
  input: CreateAlarmInput,
};

export type CreateAlarmMutation = {
  createAlarm?:  {
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

export type UpdateAlarmMutationVariables = {
  input: UpdateAlarmInput,
};

export type UpdateAlarmMutation = {
  updateAlarm?:  {
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
  getProfile: ( {
      __typename: "User",
      id: string,
      entityType: EntityType,
      created: string,
      modified?: string | null,
      discontinued: boolean,
      email: string,
      name: string,
      alarms: number,
    } | {
      __typename: "ErrorResponse",
      type: ErrorTypes,
      message?: string | null,
      code?: number | null,
    }
  ) | null,
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
