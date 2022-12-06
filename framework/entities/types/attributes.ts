import { EntityType } from "@local-types/api";
import { IntRange } from "@local-types/utility";

export type AttributeSchema<T = any, I extends boolean = false> = {
  type: T,
  immutable: I,
};

// ENTITY ATTRIBUTE SCHEMAS

export type ICommon = {
  entityType: AttributeSchema<EntityType, true>
  id: AttributeSchema<string, true>,
  created: AttributeSchema<string, true>,
  modified: AttributeSchema<string, true>,
  discontinued: AttributeSchema<boolean, true>
};

export type User = ICommon & {
  entityType: AttributeSchema<EntityType.User, true>,
  name: AttributeSchema<string>,
  email: AttributeSchema<string>,
  alarms: AttributeSchema<number, true>
};

export type Creatable = ICommon & {
  creator: AttributeSchema<string,true>
};

export type SnoozeableDuration = 3 | 5 | 10;
export type SnoozeableInterval = 3 | 5;

export type Alarm = Creatable & {
  entityType: AttributeSchema<EntityType.Alarm, true>;
  enabled: AttributeSchema<boolean, false>,
  name: AttributeSchema<string, false>,
  onceOff: AttributeSchema<boolean, false>,
  days: AttributeSchema<Array<IntRange<0,7>>, false>,
  time: AttributeSchema<{ hour: IntRange<0,24>, minute: IntRange<0,60> }, false>,
  snooze: AttributeSchema<{ duration: SnoozeableDuration, interval: SnoozeableInterval }>
};