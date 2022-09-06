
import * as types from "../../client/types/api";

/*
 * THEN:
 * Collection of functions that perform common test suites.
 */



export module Then {

  type User = Omit<types.User, "__typename" | "created">
  export function user(object:User, object1:User) {
    /* tests one object against the other for user attributes */
    const { id, name, email, alarms } = object1;
    expect(object).toMatchObject({
      id, name, email, alarms
    });
  }

}