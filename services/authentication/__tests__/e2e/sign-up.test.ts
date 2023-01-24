import { auth } from "../../../../shared/typescript/lib/amplify";
import { Given } from "../../../../shared/typescript/utilities/testing";

describe("Sign Up", () => {

  it("Signs up a user.", async () => {

    const { email, name} = Given.user.input();
    const password = Given.user.password();

    await auth.signUp({
      username: email,
      password,
      attributes: {
        name
      }
    });

  });

});