import { UpsertAlarmInput } from "@local-types/api";
import { AbsoluteUser, NullUser } from "@local-types/index";



export type SyncOptions = {
  exists: boolean
}
export type NullEntityAttributes = { id: string };

export type AbsoluteUserAttributes = { email?: string, name?: string };
export type NullUserAttributes = { id: string };

export type NullAlarmAttributes = NullEntityAttributes;
export type AlarmAttributes = Partial<UpsertAlarmInput> & { creator: NullUser | AbsoluteUser };
