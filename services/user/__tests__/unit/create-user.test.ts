import { Given, Repeat, Then } from "../../../../shared/typescript/utilities/testing";
import { ServiceIO } from "../../../../shared/typescript/io";
import { eventBridgeClient } from "../../../../shared/typescript/lib/event-bridge";

describe("Create User", () => {

  it("Creates a user", async () => {

    const { id, creator, creatorType, name, email } = Given.user.attributes(); // get attributes.
    const payload = { id, creator, creatorType, name, email };

    const result = await ServiceIO.user.create({ correlationId: id, payload }); // send a 'CREATE' input to the user service.

    expect(result.payload).toMatchObject(payload);

    const created = await Repeat.timedOnCondition({
      call: async () => {
        const userRecord = await Given.user.byId(id); // get user record from the table.
        Then(userRecord).user(payload);
        return true;
      },
      times: 10,
      duration: 100
    });

    expect(created).toBe(true);

  });

});