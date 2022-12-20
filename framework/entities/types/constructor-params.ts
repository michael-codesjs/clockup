import { AbsoluteUser } from "shared/types/index";
import { IntRange } from "shared/types/utility";
import { SnoozeableDuration, SnoozeableInterval } from "./attributes";

export type NullEntityConstructorParams = { id: string };
export type CreatableEntityConstructorParams = { creator: AbsoluteUser };
export type NullCreatableEntityConstructorParams = NullEntityConstructorParams & Partial<CreatableEntityConstructorParams>;

export type UserConstructorParams = {
  name?: string,
  email?: string
};

export type NullUserConstructorParams = {
  id: string
};

export type AlarmConstructorParams = {
  id?: string,
  creator: AbsoluteUser,
  name?: string,
  enabled?: boolean,
  days?: Array<IntRange<0,7>>,
  time?: { hour: IntRange<0,24>, minute: IntRange<0,60> },
  snooze?: { duration: SnoozeableDuration, interval: SnoozeableInterval },
  onceOff?: boolean
}