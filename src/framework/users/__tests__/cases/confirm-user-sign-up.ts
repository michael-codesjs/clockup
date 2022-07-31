
import { Given } from "../../../tests/given";

describe("confirm user sign up", () => {
  test('should sign up', async () => {

   const user = Given.aRandomUser;
   const confirmUserSignUp = await user.when.confirmUserSignUp();
   // checkForExistenceInDB
   await confirmUserSignUp.then.userExistsInTable();

  })
})