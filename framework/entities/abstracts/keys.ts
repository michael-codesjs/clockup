import { EntityType } from "@local-types/api";
import { CompositeKey } from "@local-types/index";
import { Entity } from ".";
import { ICreatable, ISubscriber } from "./interfaces";

type PartitionKey = {
	partition: string,
	sort?: string
};

export class Keys implements ISubscriber {

	public Entity: Entity | (Entity & ICreatable);
	private Primary: { PK: string, SK: string };
	private EntityIndex: { EntityIndexPK: string, EntityIndexSK: string }; /* EntityIndex is a global secondary index we force every entity to have, it is infact GSI_0 */
	/* gsi keys */
	private GSI_1: { GSI1_PK: string, GSI1_SK: string };
	private GSI_2: { GSI2_PK: string, GSI2_SK: string };
	private GSI_3: { GSI3_PK: string, GSI3_SK: string };
	private GSI_4: { GSI4_PK: string, GSI4_SK: string };
	private GSI_5: { GSI5_PK: string, GSI5_SK: string };
	private GSI_6: { GSI6_PK: string, GSI6_SK: string };
	private GSI_7: { GSI7_PK: string, GSI7_SK: string };

	/**
	 * Use to setup your GSI Keys.
	 * Also called when entity attributes changed.
	 */

	constructor(entity: Entity) {
		this.Entity = entity;
		entity.attributes.subscribe(this);
		this.update();
	}

	/**
	 * Sets Primary & EntityIndex keys
	 */
	private configureDefault() {

		const entityType = this.Entity.attributes.get("entityType");
		const id = this.Entity.attributes.get("id");
		const created = this.Entity.attributes.get("created");
		
		let key = Keys.constructKey({
			descriptors: [entityType],
			values: [id]
		});

		let creator: (Entity & ICreatable) | null;

		if (creator = "creator" in this.Entity ? this.Entity.creator as any : null) {

			const creatorId = creator.attributes.get("id");
			const creatorType = creator.attributes.get("entityType");

			this.setPrimary({
				partition: Keys.constructKey({
					descriptors: [creatorType],
					values: [creatorId]
				}),
				sort: key
			});

		} else {
			this.setPrimary({
				partition: key
			});
		}


		this.setEntityIndex({
			entity: this.constructContinuityDependantKey({
				descriptors: [entityType],
				values: []
			}),
			sort: this.constructContinuityDependantKey({
				descriptors: [entityType],
				values: [created]
			})
		});

	}

	/** updates an entities desired GSI keys */
	configure() {

	}

	/** updates keys in response to attribute changes */
	update(): void {
		this.configureDefault();
		this.configure();
	}

	primary() {
		return this.Primary;
	}

	private setPrimary(params: PartitionKey) {
		const { partition, sort } = params;
		this.Primary = {
			PK: partition,
			SK: sort || partition
		};
	}

	entityIndex() {
		return this.EntityIndex;
	}

	private setEntityIndex(params: { entity: EntityType | string, sort: string }) {
		const { entity, sort } = params;
		this.EntityIndex = {
			EntityIndexPK: entity,
			EntityIndexSK: sort
		};
	}

	GSI(gsi: number) {
		return this[`GSI_${gsi}`];
	}

	GSIs() {
		return {
			...this.GSI_1,
			...this.GSI_2,
			...this.GSI_3,
			...this.GSI_4,
			...this.GSI_5,
			...this.GSI_6,
			...this.GSI_7
		};
	}

	setGSI(params: { gsi: number, key: PartitionKey }) {
		const { gsi, key } = params;
		if (gsi > 7 || gsi < 1) throw new Error(`Can not set keys for GSI(${gsi}) as it does not exist`);
		this["GSI_" + gsi] = {
			[`GSI${gsi}_PK`]: key.partition,
			[`GSI${gsi}_SK`]: key.sort
		};
	}

	batchSetGSIs(GSIs: Array<{ gsi: number, key: PartitionKey }>) {
		GSIs.forEach(gsi => this.setGSI(gsi));
	}

	all() {
		return {
			...this.primary(),
			...this.entityIndex(),
			...this.GSIs()
		};
	}

	static constructKey(params: CompositeKey): string {

		const {
			descriptors,
			values,
			suffixes = [],
			prefixes = [],
		} = params;

		let key = '';

		for (const i in descriptors) {
			let value = values[i];
			if (typeof value === 'string') {
				value = value.toLowerCase().replace(/ /g, '_');
			}
			const descriptor = descriptors[i].toUpperCase().replace(/ /g, '_');
			key += (key.length > 0 ? '#' : '') + descriptor + (value ? '#' + value : "");
		}

		for (const i in suffixes) {
			key = key + '#' + suffixes[i];
		}

		for (let i = prefixes.length - 1; i >= 0; i--) {
			key = prefixes[i] + '#' + key;
		}

		return key;

	}

	constructContinuityDependantKey(params: CompositeKey) {
		const discontinued = this.Entity.attributes.get("discontinued");
		if (discontinued) {
			params.suffixes = (params.suffixes || []).concat(["discontinued"]);
		}
		return Keys.constructKey(params);
	}

}