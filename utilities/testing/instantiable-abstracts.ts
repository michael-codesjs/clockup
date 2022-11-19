import { EntityType, ICommon } from "@local-types/api";
import { AbsoluteUser } from "@local-types/index";
import { Attributes, Entity as AbstractEntity, Keys } from "../../framework/entities/abstracts";
import { ICreatable } from "../../framework/entities/abstracts/interfaces";

// INSTANTIABLE VERSIONS OF ABSTRACT CLASSES TO BE USED FOR TESTING
type InstatiableEntity = ICommon & {
	attribute1: string,
	attribute2: string,
	attribute3: number
};

export class Entity extends AbstractEntity {

	TypeOfSelf: typeof Entity;
	NullTypeOfSelf: typeof Entity;
	AbsoluteTypeOfSelf: typeof Entity | (typeof Entity)[];

	attributes: Attributes<InstatiableEntity> = new Attributes<InstatiableEntity>({
		attribute1: { initial: null },
		attribute2: { initial: null },
		attribute3: {
			initial: 1,
			validate: value => value > 2
		}
	});

	keys: Keys = new Keys(this);

	constructor(params?: { id?: string, entityType?: EntityType }) {
		super();
		const { id, entityType } = params || {};
		this.attributes.parse({
			id, entityType: entityType || EntityType.User
		});
	}

	async sync() {
		return this;
	}

}

type TCreatable = ICommon & {
	creator: string
}

export class CreatableEntity extends AbstractEntity implements ICreatable {

	TypeOfSelf: typeof CreatableEntity;
	NullTypeOfSelf: typeof CreatableEntity;
	AbsoluteTypeOfSelf: typeof CreatableEntity | (typeof CreatableEntity)[];
	
	creator: AbsoluteUser;

	attributes: Attributes<TCreatable> = new Attributes<TCreatable>({
		creator: {
			initial: null,
			required: true
		}
	});

	keys: Keys = new Keys(this);

	constructor(params?: { id?: string, entityType?: EntityType, creator?: AbsoluteUser }) {
		
		super();
		
		const { id, entityType } = params || {};

		this.creator = params.creator || new Entity({ entityType: EntityType.User, }) as any as AbsoluteUser;

		this.attributes.parse({
			id,
			entityType: entityType || EntityType.Alarm,
			creator:  this.creator.attributes.get("id")
		});

	}

	async sync() {
		return this;
	}

}