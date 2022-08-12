import { Given, When } from "../../../../framework/tests"

jest.setTimeout(60000);

describe("Edit User Profile", () => {

  it("Edits a users profile", async () => {

    const user = await Given.anAuthenticatedUser();
    const edits = await Given.aRandomUser();
    const updatedProfile = await When.editUser({
      name: edits.name,
      email: edits.email
    });

    expect(updatedProfile).toMatchObject({
      id: user.id,
      name: edits.name,
      email: edits.email,
      alarms: 0,
    })

  })

})