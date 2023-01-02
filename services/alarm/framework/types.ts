import { AttributeSchema, CommonAttributes } from "../../../shared/typescript/abstracts/types";
import { EntityType } from "../../../shared/typescript/types/api";
import { IntRange } from "../../../shared/typescript/types/utility";

export type SnoozeableDuration = 3 | 5 | 10;
export type SnoozeableInterval = 3 | 5;

export type AlarmAttributesSchemaCollection = CommonAttributes & {
  entityType: AttributeSchema<EntityType.Alarm, true>,
  enabled: AttributeSchema<boolean, false>,
  name: AttributeSchema<string, false>,
  onceOff: AttributeSchema<boolean, false>,
  days: AttributeSchema<Array<IntRange<0, 7>>, false>,
  time: AttributeSchema<{ hour: IntRange<0, 24>, minute: IntRange<0, 60> }, false>,
  snooze: AttributeSchema<{ duration: SnoozeableDuration, interval: SnoozeableInterval }>
};

export type NullStateAlarmConstructorParams = { id: string };

export type SemiStateAlarmConstructorParams = {
  id: string,
  enabled?: boolean,
  name?: string,
  onceOff?: boolean,
  days?: Array<IntRange<0, 7>>,
  time?: { hour: IntRange<0, 24>, minute: IntRange<0, 60> },
  snooze?: { duration: SnoozeableDuration, interval: SnoozeableInterval }
}

export type AbsoluteStateAlarmConstructorParams = Required<SemiStateAlarmConstructorParams> & { id?: string };