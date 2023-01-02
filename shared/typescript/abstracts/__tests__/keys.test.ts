import { EntityType } from "../../types/api";
import { IntRange } from "../../types/utility";
import { chance } from "../../utilities/constants";
import { getRandomEntityType } from "../../utilities/functions";
import { Entity } from "../../utilities/testing/instanciable-abstracts";
import { Keys } from "../keys";

describe("Keys", () => {

	let keys: Keys;
	let entity: Entity;

	let entityType: EntityType;
	let id: string;

	beforeEach(() => {
		entityType = getRandomEntityType();
		id = chance.guid();
		entity = new Entity({ id, entityType });
		entity.attributes.parse({ id, entityType });
		keys = new Keys(entity);
	});

	test("Keys.primary", () => {

		const key = Keys.constructKey({
			descriptors: [entity.attributes.get("entityType")],
			values: [entity.attributes.get("id")]
		});

		expect(keys.primary()).toMatchObject({
			PK: key, SK: key
		});

	});

	test("Keys.entityIndex", () => {

		expect(keys.entityIndex()).toMatchObject({
			EntityIndexPK: entity.attributes.get("entityType"),
			EntityIndexSK: `${entity.attributes.get("creatorType")}#DATE#${entity.attributes.get("created").toLowerCase()}`
		});

	});

	test("Keys.creatorIndex", () => {
		expect(keys.creatorIndex()).toMatchObject({
			CreatorIndexPK: `${entity.attributes.get("creatorType")}#${entity.attributes.get("creator")}`,
			CreatorIndexSK: `${entity.attributes.get("creatorType")}#DATE#${entity.attributes.get("created").toLowerCase()}`
		});
	});

	test("Keys.setGSI", () => {

		const gsi = chance.integer({ min: 1, max: 7 });

		keys.setGSI({
			[gsi]: {
				partition: gsi.toString(),
				sort: gsi.toString()
			}
		});

		expect((keys as any).GSIs[gsi]).toMatchObject({
			partition: gsi.toString(),
			sort: gsi.toString()
		});

	});

	test("Keys.getGSI", () => {
		const gsi = chance.integer({ min: 1, max: 7 });
		const gsiDef = keys.getGSI(gsi as IntRange<1, typeof Keys.GSI_count>);
		const gsiDefKeys = Object.keys(gsiDef);
		expect(gsiDefKeys).toContain(`GSI${gsi}_PK`);
		expect(gsiDefKeys).toContain(`GSI${gsi}_SK`);
	});

	test("Keys.setGSI", () => {

		// setGSI

		const GSIs = Array(Keys.GSI_count - 1).fill(null).reduce((...args) => {
			const cummulative = args[0];
			const index = args[2] + 1;
			cummulative[index] = {
				partition: index.toString(),
				sort: index.toString()
			};
			return cummulative;
		}, {} as any);

		keys.setGSI(GSIs);

		expect((keys as any).GSIs).toMatchObject(GSIs);

	});

	test("Keys.getGSIs", () => {

		// set GSIs so that they are returned by getGSIs
		for(let x = 1; x < Keys.GSI_count; x++) {
			(keys as any).GSIs[x] = {
				partition: x.toString(),
				sort: x.toString()
			};
		}

		const gsiDefKeys = Object.keys(keys.getGSIs());

		for (let x = 1; x < Keys.GSI_count; x++) {
			expect(gsiDefKeys).toContain(`GSI${x}_PK`);
			expect(gsiDefKeys).toContain(`GSI${x}_SK`);
		}

	});

	test("Keys.constructContinuityDependantKey", () => {

		entity.attributes.parse({ discontinued: true, entityType });
		const entityIndex = entity.keys.entityIndex();

		expect(entityIndex).toMatchObject({
			EntityIndexPK: "discontinued" + "#" + entity.attributes.get("entityType"),
			EntityIndexSK: "discontinued" + "#" + entity.attributes.get("entityType") + "#DATE#" + entity.attributes.get("created").toLowerCase()
		});

	});

});