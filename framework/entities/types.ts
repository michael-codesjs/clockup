import { AlarmRingTime, AlarmSnoozeSettings, UpsertAlarmInput, EntityType } from "@local-types/api";
import { AbsoluteUser, NullUser } from "@local-types/index";



export type SyncOptions = {
  exists: boolean
}

export type AttributesParams = {
  entityType: EntityType,
  id?: string,
  created?: string,
  modified?: string,
  discontinued?: boolean
};

export type AttributeParams<T,I> = {
  required?: boolean,
  validate?: (value: T) => boolean,
  value: T,
  immutable?: I
};

export type ImmutableAttributes = "entityType" | "id" | "created";

export enum EntityErrorMessages {
  CREATABLE_TERMINATE_MISSING_CREATOR = "Cannot terminate creatable entity without specifying it's creator",
  USER_VARIANT_NOT_FOUND = "Could not instanciate variant of from entity group *User*",
  USER_NOT_FOUND = "User not found. Failed to sync NullUser to User",
}

export type NullEntityAttributes = { id: string };
export type CreatableEntityAttributes = { creator: NullUser | AbsoluteUser };
export type NullCreatableEntityAttributes = NullEntityAttributes & Partial<CreatableEntityAttributes>;

export type AbsoluteUserAttributes = { email?: string, name?: string };
export type NullUserAttributes = { id: string };

type SnoozeSettingsMinusRingTime = { time?: AlarmRingTime, snooze: AlarmSnoozeSettings };
type RingTimeMinusSnoozeSettings = { time: AlarmRingTime, snooze?: AlarmSnoozeSettings };

export type NullAlarmAttributes = NullCreatableEntityAttributes;
export type AlarmAttributes<T = SnoozeSettingsMinusRingTime | RingTimeMinusSnoozeSettings> = (
  Partial<UpsertAlarmInput> & CreatableEntityAttributes &
  (T extends SnoozeSettingsMinusRingTime ? SnoozeSettingsMinusRingTime : RingTimeMinusSnoozeSettings)
)