import Entities from "@entities";
import { auth } from "@lib/amplify";


export type SignInCredentials = { username: string, password: string };
export type SignUpCredentials = { name: string, email: string, password: string };

export type AbsoluteUser = Awaited<ReturnType<typeof Entities.user<{ id: string, email: string, name: string }>>>;
export type NullUser = Awaited<ReturnType<typeof Entities.user<{ id: string }>>>

export type ISignUpResult = Awaited<ReturnType<typeof auth.signUp>>
