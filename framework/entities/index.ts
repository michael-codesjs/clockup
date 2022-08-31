
import { Users } from "./user/";

type UserAttributes = Users.UserAttributes | Users.NullUserAttributes;
type UserState<T> = T extends Users.UserAttributes ? Users.User : T extends Users.NullUserAttributes ? Users.NullUser : never;

/*
 * Single Facade(ish) class:
 * with static methods that return the right type/state of an entity depending on the data provided.
 * every entity has at least two types/states of itself: Absolute & Null
 * the static method Entities.user return the right type/state of the User entity.
 * @example:
 * const { id, email, name } = someSource; // eg: AppSyncIdentityCognito
 * const absoluteUser = Entities.user({ id, email, name }); // returns an absolute user
 * const nullUser = Entities.user({ id }); // returns a null user 
 */

export default abstract class Entities {

  static user<T extends UserAttributes>(args?: T): UserState<T> {
    // returns a type/state of user depending on what data you provide.
    return (args && "name" in args && "email" in args ? new Users.User(args) : new Users.NullUser(args)) as UserState<T>;
  }

  static alarm() {

  }

}