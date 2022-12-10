import { chance } from "../../utilities/constants";
import { Attribute } from "..";

describe("Attribute", () => {

	let attribute: Attribute;

	beforeEach(() => {
		attribute = new Attribute({ required: true, value: "value" });
	});

	test("setValue", () => {
		const secondValue = "second value";
		attribute.setValue(secondValue);
		expect(attribute.value).toBe(secondValue);
	});

	test("Attribute<Date>.putable & Attribute<Date>.updatable", () => {
		const attribute = new Attribute<Date, false>({ required: false, value: new Date() });
		expect(typeof attribute.putable()).toBe("string");
		expect(typeof attribute.updateable()).toBe("string");
	});

	test("Attribute.setValue modified", () => {
		const modified = new Date();
		attribute.setValue("modified value", modified);
		expect(attribute.modified).toBe(modified);
	});

	test("Attribute isUpdateable", () => {
		expect(attribute.isUpdateable()).toBe(true);
		const modified = new Date();
		attribute.setValue("modified value(updateable falsy)", new Date(modified.valueOf() + chance.integer({ min: 1, max: 1000 })));
		expect(attribute.isUpdateable(modified)).toBe(false);
		attribute.setValue("modified value(updataeable truthy)", modified);
	});

});

describe("Required Attribute", () => {

	let attribute: Attribute;

	beforeEach(() => {
		attribute = new Attribute({ required: true, value: "value" });
	});

	test("Truthy isPutable", () => {
		expect(attribute.isPutable()).toBe(true);
	});

});

describe("Required Attributes With Validators", () => {

	let attribute: Attribute;

	beforeEach(() => {
		const validate = (value: string) => (value.length) > 3 && /a/.test(value);
		attribute = new Attribute({ required: true, value: "value", validate });
	});

	test("Truthy isPutable", () => {
		expect(attribute.isPutable()).toBe(true);
	});

});