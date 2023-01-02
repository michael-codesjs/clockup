import { AttributeSchema, CommonAttributes } from "../../../shared/typescript/abstracts/types";
import { EntityType } from "../../../shared/typescript/types/api";
import { IntRange } from "../../../shared/typescript/types/utility";

export type SnoozeableDuration = 3 | 5 | 10;
export type SnoozeableInterval = 3 | 5;

export type AlarmAttributesSchemaCollection = CommonAttributes & {
  entityType: AttributeSchema<EntityType.Alarm, true>,
  creator: AttributeSchema<string, true>
  enabled: AttributeSchema<boolean, false>,
  name: AttributeSchema<string, false>,
  onceOff: AttributeSchema<boolean, false>,
  days: AttributeSchema<Array<IntRange<0,7>>, false>,
  time: AttributeSchema<{ hour: IntRange<0,24>, minute: IntRange<0,60> }, false>,
  snooze: AttributeSchema<{ duration: SnoozeableDuration, interval: SnoozeableInterval }>
};