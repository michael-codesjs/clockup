import { Given, When, Then } from "../../../../framework/tests";
import { EntityType } from "../../../../types/api";
import { constructKey } from "../../../../utilities/functions";
import { handler } from "../../functions/confirm-user-sign-up";

describe("confirm-user-sign-up", () => {

  it("confirms the user signs-up", async () => {

    const user = Given.aRandomUser();
    const { event } = When.confirmUserSignUp(user);
    await handler(event);
    const result = await Then.userExistsInTable(user.username);

    
    expect(result.Item).toMatchObject({
      entityType: EntityType.USER,
      PK: constructKey(EntityType.USER, user.username),
      SK: constructKey(EntityType.USER, user.username),
      name: user.name,
      email: user.email,
      alarms: 0
    })

  });

})