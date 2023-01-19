import { State } from ".";
import { Attributes, Entity as AbstractEntity, Keys } from "../../../abstracts";
import { IStateableEntity } from "../../../abstracts/interfaces";
import { AttributeSchema, CommonAttributes } from "../../../abstracts/types";
import { EntityType } from "../../../types/api";
import { getRandomEntityType } from "../../../utilities/functions";

type InstatiableEntityAttributesSchemaCollection = CommonAttributes & {
	attribute1: AttributeSchema<string>,
	attribute2: AttributeSchema<string>,
	attribute3: AttributeSchema<number>
};

export class Entity extends AbstractEntity implements IStateableEntity {

	attributes: Attributes<InstatiableEntityAttributesSchemaCollection> = new Attributes<InstatiableEntityAttributesSchemaCollection>({
		attribute1: { initial: null },
		attribute2: { initial: null },
		attribute3: {
			initial: 1,
			validate: value => value > 2
		}
	});

	keys: Keys = new Keys(this);
	state: State = new State(this);

	constructor(params?: { id?: string, entityType?: EntityType }) {
		super();
		const { id, entityType } = params || {};
		this.attributes.parse({
			id, entityType: entityType || getRandomEntityType()
		});
	}

	async sync() {
		return this;
	}

	async put(): Promise<AbstractEntity> {
		return this;
	}

	async discontinue(): Promise<AbstractEntity> {
		return this;
	}

	async continue(): Promise<AbstractEntity> {
		return this;
	}

	async graphQlEntity(): Promise<Record<string, any>> {
		return this.attributes.collective();
	}

}