// import { AlarmEntityFactory } from "./alarm";

import { UserFactory } from "./user";

class EntitiesFactoryCollection {

	private constructor() {}
	static readonly instance = new EntitiesFactoryCollection();

	readonly User = UserFactory.createEntity; /* User Entity Group Factory Method */
	// readonly Alarm = AlarmEntityFactory.createEntity;
	
}

const Entities = EntitiesFactoryCollection.instance;

export default Entities;