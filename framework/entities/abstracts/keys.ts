import { EntityType } from "@local-types/api";

type PartitionKey = {
  partition: string,
  sort?: string
}

export class Keys {

	private Primary: { PK: string, SK: string }; // main table primary keys
	private Entity: { EntityIndexPK: string, EntityIndexSK: string }; /* EntityIndex is a global secondary index we force every entity to have, it is infact GSI_0 */
	/* gsi keys */
	private GSI_1: { GSI1_PK: string, GSI1_SK: string };
	private GSI_2: { GSI2_PK: string, GSI2_SK: string };
	private GSI_3: { GSI3_PK: string, GSI3_SK: string };
	private GSI_4: { GSI4_PK: string, GSI4_SK: string };
	private GSI_5: { GSI5_PK: string, GSI5_SK: string };
	private GSI_6: { GSI6_PK: string, GSI6_SK: string };
	private GSI_7: { GSI7_PK: string, GSI7_SK: string };

	constructor() {
		this.primary.bind(this);
		this.entity.bind(this);
		this.GSIs.bind(this);
		this.setGSI.bind(this);
		this.all.bind(this);
	}

	primary() {
		return this.Primary;
	}

	setPrimary(params:PartitionKey) {
		const { partition, sort } = params;
		this.Primary = {
			PK: partition,
			SK: sort || partition
		};
	}

	entity() {
		return this.Entity;
	}

	setEntity(params: { entity: EntityType, sort: string }) {
		const { entity, sort } = params;
		this.Entity = {
			EntityIndexPK: entity,
			EntityIndexSK: sort
		};
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
		if (gsi > 7) throw new Error("Can not set key for GSI(" + gsi + ") as it does not exist");
		this["GSI_" + gsi] = {
			[`GSI${gsi}_PK`]: key.partition,
			[`GSI${gsi}_SK`]: key.sort
		};
	}

	all() {
		return {
			...this.primary(),
			...this.entity(),
			...this.GSIs()
		};
	}

}