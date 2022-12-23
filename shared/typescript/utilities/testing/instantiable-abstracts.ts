import { EntityType } from "../../types/api";
import { AttributeSchema, CommonAttributes } from "../../abstracts/types";
import { Attributes, Entity as AbstractEntity, Keys } from "../../abstracts";
import { ICreatable, IEntityState } from "../../abstracts/interfaces";
import { getRandomCreatableEntityType, getRandomEntityType } from "../../utilities/functions";
import { Null } from "../../abstracts/state";

// INSTANTIABLE VERSIONS OF ABSTRACT CLASSES TO BE USED FOR TESTING

type InstatiableEntity = CommonAttributes & {
	attribute1: AttributeSchema<string>,
	attribute2: AttributeSchema<string>,
	attribute3: AttributeSchema<number>
};

export class Entity extends AbstractEntity {

	attributes: Attributes<InstatiableEntity> = new Attributes<InstatiableEntity>({
		attribute1: { initial: null },
		attribute2: { initial: null },
		attribute3: {
			initial: 1,
			validate: value => value > 2
		}
	});

	keys: Keys = new Keys(this);

	protected state: IEntityState = new Null(this);

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

}

type TCreatable = CommonAttributes & {
	creator: AttributeSchema<string, true>
}

export class CreatableEntity extends AbstractEntity implements ICreatable {
	
	attributes: Attributes<TCreatable> = new Attributes<TCreatable>({
		creator: {
			initial: null,
			immutable: true,
			required: true
		}
	});
	
	keys: Keys = new Keys(this);

	protected state: IEntityState = new Null(this);

	constructor(params?: { id?: string, entityType?: EntityType, creator?: string }) {
		
		super();
		
		const { id, entityType, creator } = params || {};

		this.attributes.parse({
			id,
			entityType: entityType || getRandomCreatableEntityType(),
			creator: creator
		});

	}

	async sync() {
		return this;
	}

}