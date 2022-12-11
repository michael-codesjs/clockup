import { chance } from "../../utilities/constants";
import { getRandomEntityType } from "../../utilities/functions";
import { EntityType } from "../../types/api";
import { AttributeSchema, CommonAttributes } from "../types";
import { Attributes } from "..";

describe("Attributes", () => {

	let entityType: EntityType;
	let id: string;
	let created: string;
	let modified: string;
	let discontinued: boolean;
	let attribute: string;
	let attribute1: number;
	let attribute2: boolean;

	type A = CommonAttributes & {
		attribute: AttributeSchema<string>,
		attribute1: AttributeSchema<number>,
		attribute2: AttributeSchema<boolean>,
	};

	type S = CommonAttributes & {
		set: AttributeSchema<Record<string, any>>
	};

	type PA = Omit<A, "attribute1" | "attribute2">; // partial A

	beforeEach(() => {
		entityType = getRandomEntityType();
		id = chance.fbid();
		created = chance.date().toJSON();
		modified = chance.date().toJSON();
		discontinued = chance.bool();
		attribute = chance.word();
		attribute1 = chance.integer();
		attribute2 = chance.bool();
	});

	test("Base attributes", () => {

		const attributes = new Attributes({});

		attributes.parse({ entityType, id, created });

		expect(attributes.collective()).toMatchObject({
			entityType,
			id,
			created,
			modified: null,
			discontinued: false
		});

	});

	test("Explicit base attributes", () => {

		const attributes = new Attributes<A>({
			attribute: { initial: null },
			attribute1: { initial: null },
			attribute2: { initial: null }
		});

		attributes.parse({
			entityType, id, created, modified, discontinued,
			attribute,
			attribute1,
			attribute2
		});

		expect(attributes.collective()).toMatchObject({
			entityType,
			id,
			created: created,
			modified: modified,
			discontinued,
			attribute,
			attribute1,
			attribute2
		});

	});

	test("Attributes.get", () => {

		const values = { entityType, id, created, modified, discontinued, attribute };
		const attributes = new Attributes<PA>({ attribute: { initial: null, required: true } });

		attributes.parse(values);

		for (const key in values) {
			expect(attributes.get(key as keyof typeof values)).toBe(values[key]);
		}

	});

	test("Attributes.set", () => {
		const attributes = new Attributes<PA>({ attribute: { initial: null } });
		attributes.set({ attribute });
		expect(attributes.collective()).toMatchObject({
			attribute
		});
	});

	test("Attributes.isPutable true", () => {
		const attributes = new Attributes<PA>({ attribute: { initial: null, required: true } });
		attributes.parse({ entityType, id, attribute });
		expect(attributes.isPutable()).toBe(true);
	});

	test("Attributes.isPutable false", () => {
		const attributes = new Attributes<PA>({ attribute: { initial: null, required: true } });
		attributes.parse({ entityType, id });
		expect(attributes.isPutable()).toBe(false);
	});

	test("Attributes.valid", () => {

		const attributes = new Attributes<PA>({ attribute: { initial: null, required: true } });
		attributes.parse({ entityType, id });

		const collectiveNonNullAttributes = attributes.valid();
		const nullAttributes: Array<keyof ReturnType<typeof attributes.collective>> = ["attribute"];

		nullAttributes.forEach(attribute => expect(attribute in collectiveNonNullAttributes).toBe(false));

	});

	test("Attribute.(set & override) sets(object)", () => {

		const attributes = new Attributes<S>({ set: { initial: {}, required: true } });

		attributes.set({
			set: {
				attribute
			}
		});

		expect(attributes.get("set")).toMatchObject({ attribute });

		attributes.set({
			set: {
				attribute1, attribute2
			}
		});

		expect(attributes.get("set")).toMatchObject({ attribute, attribute1, attribute2 });

		attributes.override({
			set: {}
		});

		expect(attributes.get("set")).toMatchObject({});

	});

	test("Attributes.updatable", () => {

		const attributes = new Attributes<A>({
			attribute: { initial: null },
			attribute1: { initial: null },
			attribute2: { initial: null }
		});

		attributes.parse({
			entityType, id, created, modified, discontinued,
			attribute,
			attribute1,
			attribute2
		});

		expect(attributes.updateable()).toMatchObject({
			entityType, id,
			attribute,
			attribute1,
			attribute2
		});

		attribute = chance.word();
		attributes.set({ attribute: attribute });

		expect(attributes.updateable()).toMatchObject({
			attribute
		});

	});



});