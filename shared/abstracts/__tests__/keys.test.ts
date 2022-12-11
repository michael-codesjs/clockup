import { EntityType } from "../../types/api";
import { Keys } from "../keys";
import { CreatableEntity, Entity } from "../../utilities/testing/instantiable-abstracts";
import { getRandomCreatableEntityType, getRandomEntityType } from "../../utilities/functions";
import { chance } from "../../utilities/constants";

describe("Keys", () => {

	let keys: Keys;
	let entity: Entity;

	let entityType: EntityType;
	let id: string;

	beforeEach(() => {
		entityType = getRandomEntityType();
		id = chance.fbid();
		entity = new Entity();
		entity.attributes.parse({ id, entityType });
		keys = new Keys(entity);
	});

	test("Keys.primary && Keys.entityIndex && Keys.setGSI && Keys.batchSetGSIs && Keys.GSIs && Keys.all", () => {

		// primary && entityIndex

		const key = Keys.constructKey({
			descriptors: [entity.attributes.get("entityType")],
			values: [entity.attributes.get("id")]
		});

		expect(keys.primary()).toMatchObject({
			PK: key, SK: key
		});

		expect(keys.entityIndex()).toMatchObject({
			EntityIndexPK: entity.attributes.get("entityType")
			// REVIEW: not gonna test for EntityIndexSK for now
		});

		// setGSI

		keys.setGSI({
			1: {
				partition: "1",
				sort: "1"
			}
		});

		expect(keys.getGSI(1)).toMatchObject({
			GSI1_PK: "1",
			GSI1_SK: "1"
		});

		// batch setGSIs && GSIs

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

		const GSI_output = Array(7).fill(null).reduce((...args) => {
			const cummulative = args[0];
			const index = args[2] + 1;
			return {
				...cummulative,
				[`GSI${index}_PK`]: index.toString(),
				[`GSI${index}_SK`]: index.toString()
			};
		}, {});

		expect(keys.getGSIs()).toMatchObject(GSI_output);

		// all

		const allOutput = {
			PK: key,
			SK: key,
			EntityIndexPK: entity.attributes.get("entityType"),
			...GSI_output
		};

		expect(keys.all()).toMatchObject(allOutput);

		// nonPrimary

		expect(keys.nonPrimary()).toMatchObject({
			EntityIndexPK: entity.attributes.get("entityType"),
			...GSI_output,
		});

	});

	test("Keys.constructContinuityDependantKey", () => {
		entity.attributes.parse({ discontinued: true, entityType });
		const entityIndex = entity.keys.entityIndex();
		expect(entityIndex).toMatchObject({
			EntityIndexPK: entity.attributes.get("entityType") + "#" + "discontinued",
			EntityIndexSK: entity.attributes.get("entityType") + "#" + entity.attributes.get("created").toLowerCase() + "#" + "discontinued"
		});
	});

	test("Creatable Keys.primary", () => {

		const id = chance.fbid();
		const entityType = getRandomCreatableEntityType()

		const entity = new CreatableEntity({ id, entityType });

		expect(entity.keys.primary()).toMatchObject({
			PK: entity.creator.keys.primary().PK,
			SK: `${entityType}#${id}`
		});

	});

});