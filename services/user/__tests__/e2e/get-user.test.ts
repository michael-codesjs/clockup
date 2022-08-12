import { Given, When } from "../../../../framework/tests";

jest.setTimeout(20000);

describe("Get User Profile", () => {

  it("gets users profile", async () => {
   
    const user = await Given.anAuthenticatedUser();
    const profile = await When.getProfile();

    expect(profile).toMatchObject({
      ...user,
      alarms: 0,
    });
  
  })

})