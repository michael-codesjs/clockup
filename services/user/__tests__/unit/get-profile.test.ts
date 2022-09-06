import { Given, Then } from "@tests-utilities";
import { handler } from "../../functions/get-profile";



describe("Get User", () => {

  it("Gets a users profile", async () => {

    const user = await Given.entities.user();

    const { event } = Given.handler.appsync({
      identity: {
        sub: user.id
      }
    });

    const lambdaResponse = await handler(event);

    Then.user(lambdaResponse, user.graphqlEntity());

  });

})