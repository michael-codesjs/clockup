import { AlarmResponse } from "@client/types/api";
import { Given, Then, When } from "@utilities/testing";

describe("Create Alarm", () => {

  it("Creates an alarm", async () => {

    const creator = await Given.user.authenticated(); // start session
    const input = Given.alarm.input();

    const apiResponse = (await When.alarm.create(input)) as AlarmResponse;

    Then(apiResponse.creator).user({
      ...creator,
      alarms: 1
    });

    Then(apiResponse.alarm).alarm({
      ...input,
      id: apiResponse.alarm.id
    });

  });

});