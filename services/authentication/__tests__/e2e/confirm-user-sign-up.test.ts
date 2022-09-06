import { EntityType } from "../../../../client/types/api";
import { Given, Then, When } from "../../../../framework/test-utilities";

describe("Confirm User Sign", () => {

  it("Confirms the user signs-up", async () => {

    const attributes = Given.attributes.user(); // get random user attributes
    const { name, email, password } = attributes;
    const user = await When.auth.signUp({ name, email, password }); // sign up user e2e
    const dbRecord = await When.database.getCustomer(user.id); // get record from the table 

    Then.user(dbRecord,{
      ...user,
      alarms: 0,
      entityType: EntityType.USER
    }); // test match

  });

})