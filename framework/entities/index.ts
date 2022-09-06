
import UserFactory from "./user/user";

export default abstract class Entities {

  /* Entity Factory:
   * with static methods that return a type/state of an entity depending on the data provided.
   * every entity has at least two types/states of itself: Absolute & Null
   * the static method Entities.user return the right type/state of the User entity.
   * @example:
   * const { id, email, name } = someSource; // eg: AppSyncIdentityCognito
   * const absoluteUser = Entities.user({ id, email, name }); // returns an absolute user
   * const nullUser = Entities.user({ id }); // returns a null user 
   * --------------------------------------------------------------
   * NOTES:
   * This can be also be an implementation of an abstract factory interface
   * But for now, it's uncertain whether all Entity classes will only have 2 variants(Absolute | Null)
   * I may decide to add an Admin variant to the User Entity group or any other variant to any Entity group
   * --------------------------------------------------------------
   */

  static user = UserFactory.createEntity; /* User Entity Group Factory Method */

}