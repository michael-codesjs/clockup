import { auth } from "../../../lib/amplify";

export module Auth {

  type AuthCredentials = { email: string, password: string };

  export async function signIn({ email, password }: AuthCredentials) {

    return await auth.signIn({
      username: email,
      password
    });

  }

  type SignUpAttributes = AuthCredentials & { name: string };
  export async function signUp({ name, email, password }: SignUpAttributes) {

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
    }

  }
}