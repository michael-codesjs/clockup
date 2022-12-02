import { AlarmAttributes } from "../attributes";

describe("Attributes:", () => {

	test("Attributes.time validation", () => {

		const attributes = new AlarmAttributes();

		try {
			attributes.set({
				time: {
					hour: 55 as any,
					minute: 344 as any
				}
			});
		} catch(error:any) {
			expect(error.message).toBe("Invalid value for attribute");
		}

	});

	test("Attributes.snooze validation", () => {

		const attributes = new AlarmAttributes();

		try {
			attributes.set({
				snooze: {
					interval: 66 as any,
					duration: 344 as any
				}
			});
		} catch(error:any) {
			expect(error.message).toBe("Invalid value for attribute");
		}

	});

});