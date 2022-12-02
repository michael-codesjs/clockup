import { EntityType } from "@local-types/api";
import { CompositeKey } from "@local-types/index";
import { IntRange } from "@local-types/utility";
import { Entity } from ".";
import { ICreatable, ISubscriber } from "./interfaces";

type PartitionKey = {
	partition: string,
	sort?: string
};

/**
 * Entity keys for the table and all it's global secondary index.
 * Should be instanciated after
 */

export class Keys implements ISubscriber {

	static readonly GSI_count: 8 = 8; // number of GSIs, including entityIndex

	public Entity: Entity | (Entity & ICreatable);
	/* managed keys across all entities */
	private Primary: { PK: string, SK: string };
	private EntityIndex: { EntityIndexPK: string, EntityIndexSK: string }; /* EntityIndex is a global secondary index we force every entity to have, it is infact GSI_0 */
	/* gsi keys */
	private GSIs: Partial<Record<IntRange<1, typeof Keys.GSI_count>, PartitionKey>> = {} as any;

	constructor(entity: Entity) {
		this.Entity = entity;
		if (!entity.attributes) throw new Error("Entity attributes do not exist: keys need to subscribe to an entity's attributes");
		entity.attributes.subscribe(this);
		this.update(); // set keys
	}

	/** sets Primary & EntityIndex keys */
	private configureDefault() {

		const entityType = this.Entity.attributes.get("entityType");
		const id = this.Entity.attributes.get("id");
		const created = this.Entity.attributes.get("created");

		const key = Keys.constructKey({
			descriptors: [entityType],
			values: [id]
		});

		if ("creator" in this.Entity) {

			const { creator } = this.Entity;

			this.setPrimary({
				partition: creator.keys.primary().PK,
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

	private GSI_exists(gsi: keyof typeof this.GSIs) {
		return gsi >= 1 && gsi <= (Keys.GSI_count-1);
	}

	/** get GSI key */
	getGSI<N extends keyof typeof this.GSIs>(gsi: N): { [K in keyof Record<"PK" | "SK", any> as `GSI${N}_${K}`]: string | null } {
		gsi;
		if(!this.GSI_exists(gsi)) throw new Error("GSI does not exist");
		return  {
			[`GSI${gsi}_PK`]: this.GSIs[gsi]?.partition || null,
			[`GSI${gsi}_SK`]: this.GSIs[gsi]?.sort || null,
		};
	}

	/** get all GSI keys */
	getGSIs(): Record<keyof ReturnType<typeof this.getGSI<keyof typeof this.GSIs>>, string> {
		//
		let cumulative = {} as ReturnType<typeof this.getGSIs>; // will populate below;
		
		for(const gsi in this.GSIs) {
			cumulative = {
				...cumulative,
				...this.getGSI(gsi as unknown as keyof typeof this.GSIs)
			};
		}

		return cumulative;
	
	}

	setGSI(GSIs: Partial<Record<keyof typeof this.GSIs, PartitionKey>>) {
		Object.entries(GSIs).forEach(([s_gsi, key]) => {
			const gsi = Number(s_gsi) as keyof typeof this.GSIs;
			if(!this.GSI_exists(gsi)) throw new Error("Can not set GSI that does not exist");
			this.GSIs[gsi] = key;
		});
	}

	nonPrimary() {
		return {
			...this.entityIndex(),
			...this.getGSIs(),
		};
	}

	all() {
		return {
			...this.primary(),
			...this.entityIndex(),
			...this.getGSIs()
		};
	}

	static constructKey(params: CompositeKey): string {

		const {
			descriptors,
			values,
			suffixes = [],
			prefixes = [],
		} = params;

		let key = "";

		for (const i in descriptors) {
			let value = values[i];
			if (typeof value === "string") {
				value = value.toLowerCase().replace(/ /g, "_");
			}
			const descriptor = descriptors[i].toUpperCase().replace(/ /g, "_");
			key += (key.length > 0 ? "#" : "") + descriptor + (value ? "#" + value : "");
		}

		for (const i in suffixes) {
			key = key + "#" + suffixes[i];
		}

		for (let i = prefixes.length - 1; i >= 0; i--) {
			key = prefixes[i] + "#" + key;
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