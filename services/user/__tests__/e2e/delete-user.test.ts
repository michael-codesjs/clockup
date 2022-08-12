import { Given, When } from "../../../../framework/tests"



describe("Delete User", () => {
  
  it("Deletes a users account", async () => {

    const user = await Given.anAuthenticatedUser();

    // check if we actually created the user
    let profile = await When.getProfile();
    
    expect(profile).toMatchObject({
      ...user,
      alarms: 0
    });

    // delete the user
    const result = await When.deleteUser();

    expect(result).toBe(true);

  })
})