import { EntityType } from "shared/types/api";
import { Attributes } from "../abstracts";
import { Alarm, SnoozeableDuration, SnoozeableInterval } from "../types/attributes";
import { EntriesFromAttributesSchema, RefinedToAttributeParams } from "../types/utility";

export class AlarmAttributes extends Attributes<Alarm> {

	static readonly SnoozeableIntervals: Array<SnoozeableInterval> = [3, 5];
	static readonly SnoozeableDurations: Array<SnoozeableDuration> = [3, 5, 10];

	private static readonly config: RefinedToAttributeParams<Alarm> = {
		name: { initial: null, required: false },
		creator: { initial: null, required: true },
		days: { initial: null, required: true },
		time: {
			initial: {
				hour: null,
				minute: null
			},
			validate: ({ hour, minute }) => (hour > -1 && hour < 24) && (minute > -1 && minute <= 59),
			required: true,
		},
		enabled: { initial: null, required: true },
		onceOff: { initial: null, required: true },
		snooze: {
			initial: {
				duration: null,
				interval: null,
			},
			required: true,
			validate: value => this.SnoozeableIntervals.includes(value.interval) && this.SnoozeableDurations.includes(value.duration),
		},
	};

	constructor() {
		super(AlarmAttributes.config);
	}

	parse(attributes: Partial<EntriesFromAttributesSchema<Alarm>>): void {
		super.parse({
			...attributes,
			entityType: EntityType.Alarm
		});
	}

}