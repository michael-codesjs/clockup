import { EntityType } from "@local-types/api";
import { Chance } from "chance";

const chance = new Chance();

/*
 * ATTRIBUTES:
 * Collection of methods used to obtain random entity attributes.
 * exposed and encouraged to be accessed via the Given static class.
 * @exmaples
 * const userAttributes = Given.attributes.user();
 */

export module Attributes {

  export function user() {

    /* returns random user attributes */
    
    const name = chance.name();
    const email = chance.email();
    const username = chance.guid({ version: 4 });
    const id = username;
    const password = chance.string({ length: 8 });
    const alarms = 0;
    const entityType = EntityType.USER;

    const user = { name, email, username, id, password, alarms, entityType };

    return user;

  }

}