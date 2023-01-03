import { Given, Then } from "../../../../shared/typescript/utilities/testing";
import { ServiceIO } from "../../../../shared/typescript/io";

describe("Create User", () => {

  it("Creates a user", async () => {

    const { id, creator, creatorType, name, email } = Given.user.attributes(); // get attributes.
    const input = { id, creator, creatorType, name, email };

    await ServiceIO.user.create(input); // send CREATE message to the user sns topic which should be received and processed by the create-user lambda function.

    const userRecord = await Given.user.byId(id); // get user record from the table

    Then(userRecord).user({
      ...input,
      alarms: 0
    });

  });

});