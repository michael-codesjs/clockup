import Entities from "@entities";
import { auth } from "@lib/amplify";
import { AlarmRingTime, AlarmSnoozeSettings } from "./api";

export type CompositeKey = {
  values: (string | number | boolean)[]
  descriptors: string[]
  prefixes?: string[]
  suffixes?: string[]
}