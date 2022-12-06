import { Given, When } from "@utilities/testing";

describe("Create Alarm", () => {

  it("Creates an alarm", async () => {

    const creator = await Given.user.authenticated(); // start session
    const input = Given.alarm.input();

    const apiResponse = await When.alarm.create(input);

  });

});