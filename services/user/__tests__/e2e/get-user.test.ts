import { Given, Then, When } from "@tests-utilities";

jest.setTimeout(20000);

describe("Get User Profile", () => {

  it("gets users profile", async () => {
   
    const user = await Given.entities.autheticatedUser();
    const profile = await When.api.getProfile();

    Then.user(user, profile!);
  
  })

})