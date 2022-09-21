
import { UserFactory } from "./user";

class EntitiesFactoryCollection {

	private constructor() {}
	static readonly instance = new EntitiesFactoryCollection();

	readonly User = UserFactory.createEntity; /* User Entity Group Factory Method */

}

const Entities = EntitiesFactoryCollection.instance;

export default Entities;