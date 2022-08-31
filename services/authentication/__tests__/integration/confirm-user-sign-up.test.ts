import { Given, Then, When } from "../../../../framework/tests";
import { handler } from "../../functions/confirm-user-sign-up";

describe("confirm-user-sign-up", () => {

  it("confirms the user signs-up", async () => {

    const userAttributes = Given.attributes.user(); // get random user attributes
    const { event } = Given.handler.confirmSignUp(userAttributes); // get lambda handler params for confirmUserSignUp
    
    await handler(event);

    const dbRecord = await When.database.getCustomer(userAttributes.id);

    Then.user(dbRecord,userAttributes);

  });

})