import { Given, When, Then } from "../../../../framework/tests";
import { handler } from "../../functions/confirm-user-sign-up";

describe("user sign-up", () => {

  it("confirms the user signs-up", async () => {

    const { name, email, password } = Given.aRandomUser;
    const user = await When.userSignUp({ name, email, password });
    const result = await Then.userExistsInTable(user.username);

    console.log(result);

    expect(result.Item).toMatchObject({
      entityType: "User",
      id: user.username,
      name: user.name,
      email: user.email,
      alarms: 0
    });

  });

})