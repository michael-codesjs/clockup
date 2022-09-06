import { EntityType } from "../../../../client/types/api";
import { Given, Then, When } from "@tests-utilities"

describe("Delete User", () => {
  
  it("Deletes a users account", async () => {

    const user = await Given.entities.autheticatedUser();

    // check if we actually created the user
    let profile = await When.database.getCustomer(user.id);
    expect(profile).toBeTruthy();

    // delete the user
    const result = await When.api.deleteUser();

    expect(result).toBe(true);

    // check if the record was deleted in the table

    const postDeleteDbRecord = When.database.getCustomer(user.id);
    expect(postDeleteDbRecord).toBeNull();

  })
})