
// import { AlarmEntityFactory } from "./alarm";
// import { UserEntityFactory } from "./user/index.tsp";

class EntitiesFactoryCollection {

	private constructor() {}
	static readonly instance = new EntitiesFactoryCollection();

	// readonly User = UserEntityFactory.createEntity; /* User Entity Group Factory Method */
	// readonly Alarm = AlarmEntityFactory.createEntity;
	
}

const Entities = EntitiesFactoryCollection.instance;

export default Entities;