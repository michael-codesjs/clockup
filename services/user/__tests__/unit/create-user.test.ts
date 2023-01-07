import { Given, Repeat, Then } from "../../../../shared/typescript/utilities/testing";
import { ServiceIO } from "../../../../shared/typescript/io";

describe("Create User", () => {

  it("Creates a user", async () => {

    const { id, creator, creatorType, name, email } = Given.user.attributes(); // get attributes.
    const input = { id, creator, creatorType, name, email };

    await ServiceIO.user.create(input); // send CREATE message to the user request queue.
    
    const created = await Repeat.timedOnCondition({
      call: async () => {
        const userRecord = await Given.user.byId(id); // get user record from the table.
        console.log("U:", userRecord);
        Then(userRecord).user({
          ...input,
          alarms: 0
        });
        return true;
      },
      times: 10,
      duration: 100
    });

    expect(created).toBe(true);

  });

});