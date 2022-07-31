

import { Chance } from "chance";
import { User } from "../types/types";

const chance = Chance();

export abstract class Given {

  static get aRandomUser() {

    const name = chance.name();
    const email = chance.email();
    const username = chance.guid({ version: 4 });
    const password = chance.string({ length: 8 });

    const user:User = { name, email, username, password };

    return user;

  }



}