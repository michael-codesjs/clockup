import { chance } from "@utilities/constants";
import { getRandomEntityType } from "@utilities/functions";
import { Then } from "@utilities/testing";
import { EntityType } from "../../../../types/api";
import { Attributes } from "../attributes";

describe("Attributes", () => {

	let entityType: EntityType;
	let id: string;
	let created: string;
	let modified: string;
	let discontinued: boolean;
	let attribute: string;
	let attribute1: number;
	let attribute2: boolean;

	beforeEach(() => {
		entityType = getRandomEntityType();
		id = chance.fbid();
		created = chance.date().toJSON();
		modified = chance.date().toJSON();
		discontinued = chance.bool();
		attribute = "string",
		attribute1 = 1,
		attribute2 = true;
	});
  
	test("Base attributes", () => {
		const attributes = new Attributes({});
		attributes.parse({ entityType, id });
		expect(attributes.collective()).toMatchObject({
			entityType,
			id,
			created: Then.dateMatch(),
			modified: null,
			discontinued: false
		});
	});

	test("Explicit base attributes", () => {

		const attributes = new Attributes<{ attribute: string, attribute1: number, attribute2: boolean }>({
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
			created: Then.dateMatch(),
			modified: Then.dateMatch(),
			discontinued,
			attribute,
			attribute1,
			attribute2
		});

	});

	test("Attributes.get", () => {

		const values = { entityType, id, created, modified, discontinued, attribute };
		const attributes = new Attributes<{ attribute: string }>({ attribute: { initial: null }});

		attributes.parse(values);

		for(const key in values) {
			expect(attributes.get(key as keyof typeof values)).toBe(values[key]);
		}

	});

	test("Attributes.set", () => {
		const attributes = new Attributes({});
		attributes.set({
			discontinued: true,
		});
		expect(attributes.collective()).toMatchObject({
			modified: Then.dateMatch(),
			discontinued: true,
		});
	});

	test("Attributes.putable true", () => {
		const attributes = new Attributes<{ attribute: string }>({ attribute: { initial: null, required: true }});
		attributes.parse({ entityType, id, attribute });
		expect(attributes.putable()).toBe(true);
	});

	test("Attributes.putable false", () => {
		const attributes = new Attributes<{ attribute: string }>({ attribute: { initial: null, required: true }});
		attributes.parse({ entityType, id });
		expect(attributes.putable()).toBe(false);
	});

});