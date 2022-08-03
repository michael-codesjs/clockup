import { Given, Then, When } from "../../../../framework/tests";

describe("user sign-up", () => {

  it("confirms the user signs-up", async () => {

    const { name, email, password } = Given.aRandomUser();
    const user = await When.userSignUp({ name, email, password });
    const result = await Then.userExistsInTable(user.id);

    expect(result.Item).toMatchObject({
      entityType: "User",
      ...user,
      alarms: 0
    });

  });

})