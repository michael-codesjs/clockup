import { EntityType } from "../types/api";
import { CompositeKey } from "../types";
import { IntRange } from "../types/utility";
import { Entity } from ".";
import { ICreatable, ISubscriber } from "./interfaces";

type PartitionKey = {
	partition: string,
	sort?: string
};

type GetGSIs<E extends number, S extends number = 1> = Partial<Record<IntRange<S, E>, PartitionKey>>

type PKSK = "PK" | "SK";

type GetGSIReturnType<N extends number> = {
	[K in keyof Record<PKSK, any> as `GSI${N}_${K}`]: string | null
};

type GetGSIsReturnType = Record<
	keyof GetGSIReturnType<IntRange<1, typeof Keys.GSI_count>>,
	string | null | undefined
>;

/**
 * Entity keys for the table and all it's global secondary index.
 */

export class Keys implements ISubscriber {

	static readonly GSI_count: 8 = 8; // number of GSIs, including entityIndex

	public entity: Entity | (Entity & ICreatable);
	/** managed keys across all entities */
	private Primary: { PK: string, SK: string };
	private EntityIndex: { EntityIndexPK: string, EntityIndexSK: string }; /* EntityIndex is a global secondary index we force every entity to have, it is infact GSI_0 */
	/** gsi keys */
	private GSIs: GetGSIs<typeof Keys.GSI_count> = {} as typeof this.GSIs;

	// should be instanciated after an entity's attributes because the keys subscribe to the attributes.
	constructor(entity: Entity) {
		this.entity = entity;
		if (!entity.attributes) throw new Error("Entity attributes do not exist: keys need to subscribe to an entity's attributes");
		this.entity.attributes.subscribe(this);
		this.update(); // set keys
	}

	/** sets Primary & EntityIndex keys */
	private configureDefault() {

		const entityType = this.entity.attributes.get("entityType");
		const id = this.entity.attributes.get("id");
		const created = this.entity.attributes.get("created");

		const key = Keys.constructKey({
			descriptors: [entityType],
			values: [id]
		});

		this.setPrimary({
			partition: key
		});

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
		return gsi >= 1 && gsi <= (Keys.GSI_count - 1);
	}
	/** get GSI key */
	getGSI<N extends keyof typeof this.GSIs>(gsi: N): GetGSIReturnType<N> {
		if (!this.GSI_exists(gsi)) throw new Error("GSI does not exist");
		return {
			[`GSI${gsi}_PK`]: this.GSIs[gsi]?.partition || null,
			[`GSI${gsi}_SK`]: this.GSIs[gsi]?.sort || null,
		} as GetGSIReturnType<N>;
	}

	/** get all GSI keys */
	getGSIs(): GetGSIsReturnType {
		//
		let cumulative = {} as ReturnType<typeof this.getGSIs>; // will populate below;

		for (const gsi in this.GSIs) {
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
			if (!this.GSI_exists(gsi)) throw new Error("Can not set GSI that does not exist");
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
		const discontinued = this.entity.attributes.get("discontinued");
		if (discontinued) {
			params.prefixes = (params.prefixes || []).concat(["discontinued"]);
		}
		return Keys.constructKey(params);
	}

}