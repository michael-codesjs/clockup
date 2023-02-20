import { ServiceIO } from "../../../../shared/typescript/io";
import { EntityType } from "../../../../shared/typescript/types/api";
import { Given, Repeat } from "../../../../shared/typescript/utilities/testing";

describe("Discontinue User", () => {

  test("Discontinue User", async () => {

    const user = await Given.user.new();

    await ServiceIO.user.discontinue({
      source: "clockup.user.tests.unit.discontinue-user",
      payload: {
        id: user.id,
        creatorType: user.creatorType as EntityType.User,
        creator: user.creator
      }
    });
    
    const wasUserDiscontinued = await Repeat.timedOnCondition({
      times: 30,
      duration: 100,
      call: async () => {
        const { discontinued } = await Given.user.byId(user.id);
        return discontinued === true;
      }
    });

    expect(wasUserDiscontinued).toBe(true);
    
  });

});