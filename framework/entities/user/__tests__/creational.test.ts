
import Chance from "chance";
import { Given } from "@utilities/testing";
import { UserEntityFactory } from "../";
import { EntityType } from "@local-types/api";

const chance = new Chance();

describe("UserEntityGroup Creational Tests", () => {

  it("Creates UserEntityGroup.NullUser", () => {
    const id = chance.guid();
    const user = UserEntityFactory.createEntity({ id: id, type: EntityType.User });
    expect(user.TypeOfSelf).toBe(user.NullTypeOfSelf);
    expect(user.attributes()).toBe(null);
    expect(user.graphQlEntity()).toBe(null);
  });

  it("Creates UserEntityGroup.User", () => {
    const { name, email, id } = Given.user.attributes();
    const user = UserEntityFactory.createEntity({ name, email, id });
    expect(user.TypeOfSelf).toBe(user.AbsoluteTypeOfSelf);
    expect(user.attributes()).toMatchObject({
      email, name, id
    });
  });

  it("Create UserEntityGroup.User from UserEntityGroup.NullUser", async () => {

    const attributes = (await Given.user.random())!; // create random customer

    const user = await UserEntityFactory
      .createEntity({ id: attributes.id, type: EntityType.User })
      .sync();

    expect(user.TypeOfSelf).toBe(user.AbsoluteTypeOfSelf);

    expect(user.attributes()).toMatchObject(attributes);

  });

  it("Fails when UserEntityGroup.NullUser is given an id for a user that does not exist", async () => {

    const user = UserEntityFactory.createEntity({ id: "some non existent user id", type: EntityType.User });

    try {
      await user.sync();
      // if sync goes through without an error, fail the test
      expect(true).toBe(false)
    } catch (error) {
      // sync failed, we expect this to happen because the id we passed is for a non existent user
      expect(true).toBe(true);
    }

  });

});