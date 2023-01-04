import { EntityType } from "../../../../shared/typescript/types/api";
import { AlarmAttributes } from "../attributes";
import { Given } from "../../../../shared/typescript/utilities/testing";

describe("UserAttribtues", () => {

	let attributes: AlarmAttributes;

	beforeEach(() => {
		attributes = new AlarmAttributes();
	});

	test("collective", () => {
		// check if it only returns attributes that exist in cognito
		const keys = Object.keys(attributes.collective());
		const attributesCollection = ["name", "days", "time", "enabled", "onceOff", "snooze"];
		attributesCollection.forEach(attribute => expect(keys).toContain(attribute));
	});

});