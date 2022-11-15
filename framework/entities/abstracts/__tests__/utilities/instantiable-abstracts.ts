import { EntityType, ICommon } from "@local-types/api";
import { Attributes, Entity as AbstractEntity, Keys } from "../..";

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

	constructor(params?: { id?: string }) {
		super();
		this.attributes.parse({
			...params,
			entityType: EntityType.User
		});
	}

	async sync() {
		return this;
	}

}