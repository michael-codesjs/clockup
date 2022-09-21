import { BasicAuthCredentials } from "aws-sdk/clients/appflow";
import { auth } from "../../../lib/amplify";
import { SignInCredentials, SignUpCredentials } from "@local-types/index";

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
			cognitoUser: user
		};

	}
}

export const Authentication = AuthenticationUtility.instance;