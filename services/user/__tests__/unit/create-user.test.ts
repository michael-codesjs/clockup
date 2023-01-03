import { Given, Then } from "../../../../shared/typescript/utilities/testing";
import { ServiceIO } from "../../../../shared/typescript/io";

describe("Create User", () => {

  it("Creates a user", async () => {

    const { id, creator, creatorType, name, email } = Given.user.attributes(); // get attributes.
    const input = { id, creator, creatorType, name, email };

    await ServiceIO.user.create(input);

    const userRecord = await Given.user.byId(id); // get user record from the table

    Then(userRecord).user({
      ...input,
      alarms: 0
    });

  });

});