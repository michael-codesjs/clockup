import { AlarmRingTime, AlarmSnoozeSettings, EntityType, CreateAlarmInput } from "@local-types/api";
import { AbsoluteUser } from "@local-types/index";

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

export type AttributeParams<T, I> = {
  required?: boolean,
  validate?: (value: T) => boolean,
  value?: T,
  immutable?: I
};

export type ImmutableAttributes = "entityType" | "id" | "created";

export enum EntityErrorMessages {
  ATTEMPT_TO_MUTATE_IMMUTABLE = "Attempting to mutate immutable attribute",
  CREATABLE_TERMINATE_MISSING_CREATOR = "Cannot terminate creatable entity without specifying it's creator",
  CREATABLE_BY_CREATOR_NOT_FOUND = "Creatable by user was not found",
  USER_VARIANT_NOT_FOUND = "Could not instanciate variant of from entity group *User*",
  USER_NOT_FOUND = "User not found. Failed to sync NullUser to User",
  ALARM_VARIANT_NOT_FOUND = "Could not instanciate variant of from entity group *Alarm*",
}

export type NullEntityAttributes = { id: string };
export type CreatableEntityAttributes = { creator: AbsoluteUser };
export type NullCreatableEntityAttributes = NullEntityAttributes & Partial<CreatableEntityAttributes>;

type SnoozeSettingsMinusRingTime = { time?: AlarmRingTime, snooze: AlarmSnoozeSettings };
type RingTimeMinusSnoozeSettings = { time: AlarmRingTime, snooze?: AlarmSnoozeSettings };

export type NullAlarmAttributes = NullCreatableEntityAttributes;
export type AlarmAttributes<T = SnoozeSettingsMinusRingTime | RingTimeMinusSnoozeSettings> = (
  Partial<CreateAlarmInput> & CreatableEntityAttributes &
  (T extends SnoozeSettingsMinusRingTime ? SnoozeSettingsMinusRingTime : RingTimeMinusSnoozeSettings)
) & { creator: AbsoluteUser };