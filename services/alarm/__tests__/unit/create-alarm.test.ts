import { Given, HandlerArguments, Then } from "@utilities/testing";
import { handler } from "../../functions/create-alarm";

describe("Create Alarm", () => {

  it("Creates an alarm", async () => {

    const creator = await Given.user.authenticatedInstance();
    const input = Given.alarm.input();

    const { event, context } = HandlerArguments.alarm.create(input, creator);

    const lambdaResponse = await handler(event, context);
    
    Then(lambdaResponse.alarm).alarm({ id: lambdaResponse.alarm.id, ...input });

    Then(lambdaResponse.creator).user({
      ...creator.graphQlEntity(),
      alarms: 1
    });

  });

});