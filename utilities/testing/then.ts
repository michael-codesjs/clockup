
import * as types from "@local-types/api";

type User = Omit<types.User, "__typename" | "created" | "entityType">; // created and entityType are still gonna be tested for
type PoolUser = {
	sub: string,
	name: string,
	email: string
}

class ThenUtility {

	/* TEST CASES */

	private constructor() {}
	static readonly instance = new ThenUtility();

	readonly dateMatch = () => expect.stringMatching(/\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d(?:\.\d+)?Z?/g);

	user_VS_user(object:User, object1:User) {
		/* tests one object against the other for user attributes */
		const { id, name, email } = object1;
		expect(object).toMatchObject({
			id, name, email,
			entityType: types.EntityType.User,
			created: this.dateMatch()
		});
	}

	poolUser_VS_user(object:PoolUser, object1: Omit<User, "created">) {
		const { id, name, email } = object1;
		expect(object).toMatchObject({
			sub: id,
			name, email
		});
	} 

}

export const Then = ThenUtility.instance;