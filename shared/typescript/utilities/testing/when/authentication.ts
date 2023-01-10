import { EntityType } from "../../../types/api";
import { auth } from "../../../lib/amplify";

type SignInCredentials = {
	username: string,
	password: string
}

type SignUpCredentials = {
	name: string,
	email: string,
	password: string
};

class AuthenticationUtility {

	private constructor() {}
	static readonly instance = new AuthenticationUtility();

	async signIn({ username, password }: SignInCredentials) {

		return await auth.signIn({
			username, password
		});

	}
  
	async signUp({ name, email, password }: SignUpCredentials) {

		const { userSub, user } = await auth.signUp({
			username: email,
			password,
			attributes: {
				name
			}
		});

		return {
			name, id: userSub, email,
			entityType: EntityType.User,
			discontinued: false,
			cognitoUser: user
		};

	}

	async signOut() {
		return await auth.signOut({ global: true });
	}

}

export const Authentication = AuthenticationUtility.instance;