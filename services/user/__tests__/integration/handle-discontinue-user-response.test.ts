import { DISCONTINUED, Inputs } from "../../../../shared/typescript/io/types/user";
import { eventBridgeClient } from "../../../../shared/typescript/lib/event-bridge";
import { EntityType } from "../../../../shared/typescript/types/api";
import { chance } from "../../../../shared/typescript/utilities/constants";
import { configureEnviromentVariables, delay } from "../../../../shared/typescript/utilities/functions";
import { Given } from "../../../../shared/typescript/utilities/testing";
import { wasUserDeletedFromCognitoUserPool } from "../utilities";

const { EVENT_BUS_NAME } = configureEnviromentVariables();

describe("Handle Discontinue User Response", () => {

  test("Handle Discontinue User Response(Success)", async () => {

    const user = await Given.user.authenticated();

    const eventDetail: DISCONTINUED = {
      type: Inputs.DISCONTINUED,
      correlationId: chance.guid(),
      payload: {
        success: true,
        payload: {
          creatorType: user.creatorType as EntityType.User,
          creator: user.creator,
          id: user.creator
        }
      }
    };

    const putEventsArgs = {
      Entries: [{
        DetailType: Inputs.DISCONTINUED,
        Detail: JSON.stringify(eventDetail),
        EventBusName: EVENT_BUS_NAME,
        Source: "clockup.user.tests.integration.handle-discontinue-user"
      }]
    };

    await eventBridgeClient()
      .putEvents(putEventsArgs)
      .promise();

    await delay(3000);

    const wasUserDeletedFromCognito = await wasUserDeletedFromCognitoUserPool(user.id, { times: 30, duration: 100 });
    expect(wasUserDeletedFromCognito).toBe(true);

  });

});