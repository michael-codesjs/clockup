import { Given, When, Then } from "../../../../framework/tests";
import { handler } from "../../functions/confirm-user-sign-up";

describe("confirm-user-sign-up", () => {

  it("confirms the user signs-up", async () => {

    const user = Given.aRandomUser;
    const { event } = When.confirmUserSignUp(user);
    await handler(event);
    const result = await Then.userExistsInTable(user.username);

    
    expect(result.Item).toMatchObject({
      entityType: "User",
      id: user.username,
      name: user.name,
      email: user.email,
      alarms: 0
    })

  });

})