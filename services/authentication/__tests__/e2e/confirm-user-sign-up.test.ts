import { Given, Then, When } from "../../../../framework/tests";
import { EntityType } from "../../../../types/api";
import { constructKey } from "../../../../utilities/functions";

describe("user sign-up", () => {

  it("confirms the user signs-up", async () => {

    const { name, email, password } = Given.aRandomUser();
    const user = await When.userSignUp({ name, email, password });
    const result = await Then.userExistsInTable(user.id);

    expect(result.Item).toMatchObject({
      entityType: EntityType.USER,
      PK: constructKey(EntityType.USER, user.id),
      SK: constructKey(EntityType.USER, user.id),
      name: user.name,
      email: user.email,
      alarms: 0
    });

  });

})