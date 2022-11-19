import { Alarm, EntityType, UpsertAlarmInput } from "@local-types/api";
import { RefinedToAttributeParams } from "@local-types/utility";
import { Attributes } from "../abstracts";

export class AlarmAttributes extends Attributes<Alarm> {

	private static readonly config: RefinedToAttributeParams<Alarm> = {
		name: { initial: null, required: true },
    creator: { initial: null, required: true },
    days: { initial: [], required: true },
    time: {
      initial: {
        hour: null,
        minute: null
      },
      validate: ({ hour, minute }) => (hour > -1 && hour < 24) && (minute > -1 && minute < 59)
    },
    enabled: { initial: true, required: true },
    onceOff: { initial: false, required: true },
    snooze: {
      initial: {
        duration: null,
        interval: null,
      },
      required: true,
      validate: value => value.duration > -1 && value.interval > -1,
    },
	};

	constructor() {
		super(AlarmAttributes.config);
	}

	parse(attribtues: Partial<Alarm>) {
		super.parse({
			...attribtues,
			entityType: EntityType.Alarm
		});
	}

  set(attributes: Omit<UpsertAlarmInput, "id">) {
    super.set(attributes);
  }

}