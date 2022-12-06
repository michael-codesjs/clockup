import { Given, HandlerArguments } from "@utilities/testing";
import { handler } from "../../functions/create-alarm";

describe("Create Alarm", () => {

  it("Creates an alarm", async () => {

    const creator = await Given.user.instance();
    const input = Given.alarm.input();

    const { event, context } = HandlerArguments.alarm.create(input, creator);

    const lambdaResponse = await handler(event, context);
    
    expect(lambdaResponse.alarm).toMatchObject(input);
    expect(lambdaResponse.creator).toMatchObject(creator.graphQlEntity());

  });

});