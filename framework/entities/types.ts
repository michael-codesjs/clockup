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

export enum EntityErrorTypes {
  CREATABLE_TERMINATE_MISSING_CREATOR = "Cannot terminate creatable entity without specifying it's creator"
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