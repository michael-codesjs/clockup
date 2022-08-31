
import EntityFactory from "../../entities";
import { Auth } from "../when/auth";
import { Attributes } from "./attributes";

export module Entities {

  export async function user() {

    /* inserts a new user into the database without going through cognito */
    /* use for user service unit tests that should not rely on the authentication service */

    const attributes = Attributes.user();
    
    const user = EntityFactory.user({
      ...attributes,
      id: attributes.username
    });

    return await user.sync();

  }

  export async function autheticatedUser() {
    
    const attributes = Attributes.user();
    await Auth.signUp(attributes);
    const user = await Auth.signIn({
      ...attributes,
    });

    return user;
  }
}