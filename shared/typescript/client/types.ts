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
  creator: string,
  creatorType: EntityType,
  created: string,
  modified?: string | null,
  discontinued: boolean,
  email: string,
  name: string,
};

export type Common = {
  __typename: "Common",
  id: string,
  entityType: EntityType,
  creator: string,
  creatorType: EntityType,
  created: string,
  modified?: string | null,
  discontinued: boolean,
};

export type Alarm = {
  __typename: "Alarm",
  id: string,
  entityType: EntityType,
  creator: string,
  creatorType: EntityType,
  created: string,
  modified?: string | null,
  discontinued: boolean,
  name?: string | null,
  enabled?: boolean | null,
  days?: Array< number > | null,
  time: AlarmRingTime,
  snooze: AlarmSnoozeSettings,
  onceOff?: boolean | null,
};

export enum EntityType {
  USER = "USER",
  ALARM = "ALARM",
  NOTE = "NOTE",
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

export type Note = {
  __typename: "Note",
  id: string,
  entityType: EntityType,
  creator: string,
  creatorType: EntityType,
  created: string,
  modified?: string | null,
  discontinued: boolean,
  title?: string | null,
  body?: string | null,
};

export type ErrorResponse = {
  __typename: "ErrorResponse",
  type: ErrorTypes,
  message: string,
  cause?: string | null,
};

export enum ErrorTypes {
  NOT_FOUND = "NOT_FOUND",
  MALFOMED_INPUT = "MALFOMED_INPUT",
  INTERNAL_ERROR = "INTERNAL_ERROR",
  CREATE_FAILED = "CREATE_FAILED",
  UPDATE_FAILED = "UPDATE_FAILED",
  DELETE_FAILED = "DELETE_FAILED",
}


export type AsyncOperationOutput = AsyncOperationResponse | ErrorResponse


export type AsyncOperationResponse = {
  __typename: "AsyncOperationResponse",
  status: AsyncOperationStatus,
  CID: string,
};

export enum AsyncOperationStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}


export type CreateAlarmInput = {
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

export type AlarmOutput = AlarmResponse | ErrorResponse


export type AlarmResponse = {
  __typename: "AlarmResponse",
  alarm: Alarm,
  creator: User,
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
      creator: string,
      creatorType: EntityType,
      created: string,
      modified?: string | null,
      discontinued: boolean,
      email: string,
      name: string,
    } | {
      __typename: "ErrorResponse",
      type: ErrorTypes,
      message: string,
      cause?: string | null,
    }
  ),
};

export type DeleteUserMutation = {
  deleteUser: ( {
      __typename: "AsyncOperationResponse",
      status: AsyncOperationStatus,
      CID: string,
    } | {
      __typename: "ErrorResponse",
      type: ErrorTypes,
      message: string,
      cause?: string | null,
    }
  ),
};

export type CreateAlarmMutationVariables = {
  input: CreateAlarmInput,
};

export type CreateAlarmMutation = {
  createAlarm: ( {
      __typename: "AlarmResponse",
      alarm:  {
        __typename: string,
        id: string,
        entityType: EntityType,
        creator: string,
        creatorType: EntityType,
        created: string,
        modified?: string | null,
        discontinued: boolean,
        name?: string | null,
        enabled?: boolean | null,
        days?: Array< number > | null,
        time:  {
          __typename: string,
          hour: number,
          minute: number,
        },
        snooze:  {
          __typename: string,
          duration: number,
          interval: number,
        },
        onceOff?: boolean | null,
      },
      creator:  {
        __typename: string,
        id: string,
        entityType: EntityType,
        creator: string,
        creatorType: EntityType,
        created: string,
        modified?: string | null,
        discontinued: boolean,
        email: string,
        name: string,
      },
    } | {
      __typename: "ErrorResponse",
      type: ErrorTypes,
      message: string,
      cause?: string | null,
    }
  ),
};

export type UpdateAlarmMutationVariables = {
  input: UpdateAlarmInput,
};

export type UpdateAlarmMutation = {
  updateAlarm: ( {
      __typename: "AlarmResponse",
      alarm:  {
        __typename: string,
        id: string,
        entityType: EntityType,
        creator: string,
        creatorType: EntityType,
        created: string,
        modified?: string | null,
        discontinued: boolean,
        name?: string | null,
        enabled?: boolean | null,
        days?: Array< number > | null,
        time:  {
          __typename: string,
          hour: number,
          minute: number,
        },
        snooze:  {
          __typename: string,
          duration: number,
          interval: number,
        },
        onceOff?: boolean | null,
      },
      creator:  {
        __typename: string,
        id: string,
        entityType: EntityType,
        creator: string,
        creatorType: EntityType,
        created: string,
        modified?: string | null,
        discontinued: boolean,
        email: string,
        name: string,
      },
    } | {
      __typename: "ErrorResponse",
      type: ErrorTypes,
      message: string,
      cause?: string | null,
    }
  ),
};

export type GetProfileQuery = {
  getProfile: ( {
      __typename: "User",
      id: string,
      entityType: EntityType,
      creator: string,
      creatorType: EntityType,
      created: string,
      modified?: string | null,
      discontinued: boolean,
      email: string,
      name: string,
    } | {
      __typename: "ErrorResponse",
      type: ErrorTypes,
      message: string,
      cause?: string | null,
    }
  ),
};

export type GetAlarmQueryVariables = {
  id: string,
};

export type GetAlarmQuery = {
  getAlarm:  {
    __typename: "Alarm",
    id: string,
    entityType: EntityType,
    creator: string,
    creatorType: EntityType,
    created: string,
    modified?: string | null,
    discontinued: boolean,
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
  },
};
