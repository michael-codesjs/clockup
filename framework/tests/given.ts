
import { Chance } from "chance";
import { When } from ".";
import { configureEnviromentVariables } from "../../utilities/functions";
import { User } from "../types/types";

configureEnviromentVariables();

const chance = Chance();

export module Given {

  export function aRandomUser() {

    const name = chance.name();
    const email = chance.email();
    const username = chance.guid({ version: 4 });
    const password = chance.string({ length: 8 });

    const user:User = { name, email, username, password };

    return user;

  }

  export async function anAuthenticatedUser() {
    
    const randomUserDetails = aRandomUser();
    const user = await When.userSignUp(randomUserDetails);
    await When.userSignIn({
      ...user,
      password: randomUserDetails.password
    });

    return user;
  }



}