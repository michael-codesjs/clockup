import { AbsoluteUser } from "@local-types/index";
import { userInstanciator } from "@middleware/user-instanciator";
import middy from "@middy/core";
import { chance } from "@utilities/constants";
import { Given } from "@utilities/testing";
import { AppSyncResolverEvent } from "aws-lambda";

describe("Creator Instaciator", () => {

  let user: AbsoluteUser;

  beforeEach(async () => {
    user = await Given.user.instance();
  });

  const withMiddleware = (lambda: any) => middy(lambda).use(userInstanciator());

  /** generates event payload for lambdas */
  const getEvent = (sub: string) => ({
    identity: { sub },
    arguments: {}
  } as any);

  const lambda = withMiddleware((event: AppSyncResolverEvent<any>) => {
    expect(event.arguments.user.attributes.collective()).toMatchObject(user.attributes.collective());
  });

  it("Instaciates an absolute user entity from the sub in identity", async () => {
    await lambda(getEvent(user.attributes.get("id")), {} as any);
  });

  it("Fails to instaciate a user when given a non existent user id", async () => {
    try {
      await lambda(getEvent(chance.fbid()), {} as any);
      throw new Error("Was expecting operation to fail");
    } catch(error: any) {
      expect(error.message).toBe("User not found. Failed to sync NullUser to User");
    }
  });

});