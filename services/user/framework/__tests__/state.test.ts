import { pickRandomAttributesFromObject } from "../../../../shared/typescript/utilities/functions";
import { Given, Then } from "../../../../shared/typescript/utilities/testing";
import { InsufficientAttributeToCreateUser } from "../errors/insufficient-attributes-to-create-user";
import { UserNotFoundError } from "../errors/user-not-found";
import { Absolute, Null, Semi } from "../states";
import { User } from "../user";

// TODO: Refactor, lot of repitition.

describe("Null.", () => {

  test("State is null when it is supposed to be null", () => {
    const user = new User({ id: "ID" });
    expect(user.state).toBeInstanceOf(Null);
  });

  test("Put", async () => {
    try {
      const user = new User({ id: "ID" });
      await user.put();
      throw new Error("Expecting put to fail and throw InsufficientAttributeToCreateUser error.");
    } catch (error: any) {
      expect(error).toBeInstanceOf(InsufficientAttributeToCreateUser);
    }
  });

  test("Sync when the user does not exist", async () => {

    try {
      const user = new User({ id: "Some non existent user id." });
      await user.sync();
      throw new Error("Expecting sync to fail and throw UserNotFoundError.")
    } catch (error: any) {
      expect(error).toBeInstanceOf(UserNotFoundError);
    }

  });

  test("Sync when user exists", async () => {

    const attributes = await Given.user.new(); // create random user
    const user = new User({ id: attributes.id });
    await user.sync();
    Then(attributes).user(user.attributes.valid());

  });


  test("graphQlEntity", async () => {

    const attributes = await Given.user.new();
    const user = new User({ id: attributes.id });
    const graphQlEntity = await user.graphQlEntity();

    expect(user.state).toBeInstanceOf(Absolute);
    Then(attributes).user(graphQlEntity);

  });

});

describe("Semi.", () => {

  test("State is semi when it is supposed to be semi", () => {
    const user = new User({ id: "ID", name: "NAME" });
    expect(user.state).toBeInstanceOf(Semi);
  });

  test("Put", async () => {
    try {
      const user = new User({ id: "ID", name: "NAME" });
      await user.put();
      throw new Error("Expecting put to fail and throw InsufficientAttributeToCreateUser error.");
    } catch (error: any) {
      expect(error).toBeInstanceOf(InsufficientAttributeToCreateUser);
    }
  });

  test("Sync when the user does not exist", async () => {
    try {
      const user = new User({ id: "Some non existent user id.", name: "USER" });
      await user.sync();
      throw new Error("Expecting sync to fail and throw UserNotFoundError.")
    } catch (error: any) {
      expect(error).toBeInstanceOf(UserNotFoundError);
    }
  });

  test("Sync when user exists", async () => {

    const { id, ...rest } = await Given.user.new(); // create random user

    const input = Given.user.input();
    const attributes = pickRandomAttributesFromObject(input); // get random attributes from the user input

    const user = new User({ id, ...attributes });

    expect(user.state).toBeInstanceOf(Semi);

    await user.sync();

    const postEditAttributes = {
      ...rest,
      ...attributes,
      id,
      modified: user.attributes.get("modified")
    }

    expect(postEditAttributes).toMatchObject(user.attributes.valid());

  });

  test("graphQlEntity", async () => {

    const attributes = await Given.user.new();
    const user = new User({ id: attributes.id });
    const graphQlEntity = await user.graphQlEntity();

    expect(user.state).toBeInstanceOf(Absolute);
    Then(attributes).user(graphQlEntity);

  });

});

describe("Absolute", () => {

  let id: string;
  let name: string;
  let email: string;

  beforeEach(() => {
    const attributes = Given.user.attributes();
    id = attributes.id;
    name = attributes.name;
    email = attributes.email;
  });

  test("State is absolute when it is supposed to be absolute", () => {
    const user = new User({ id, name, email });
    expect(user.state).toBeInstanceOf(Absolute);
  });

  test("Put", async () => {

    const user = new User({ id, name, email });
    await user.put(); // insert user record into the table

    const postCreationRecord = await Given.user.byId(id); // get user record from the table
    expect(postCreationRecord).toMatchObject(user.attributes.collective()); // test inserted attributes against entity attributes.

  });

  test("Sync when the user does not exist", async () => {
    try {
      const user = new User({ id, name, email });
      await user.sync();
      throw new Error("Expecting sync to fail and throw UserNotFoundError.")
    } catch (error: any) {
      expect(error).toBeInstanceOf(UserNotFoundError);
    }
  });

  test("Sync when user exists", async () => {

    const { id, ...rest } = await Given.user.new(); // create random user

    const user = new User({ id, name, email });

    expect(user.state).toBeInstanceOf(Absolute);

    await user.sync();

    const postEditAttributes = {
      ...rest,
      name, email,
      id,
      modified: user.attributes.get("modified")
    }

    expect(postEditAttributes).toMatchObject(user.attributes.valid());

  });

  test("graphQlEntity", async () => {

    const attributes = Given.user.attributes();
    const user = new User(attributes);

    expect(user.state).toBeInstanceOf(Absolute);

    Then(await user.graphQlEntity()).user(attributes);

  });

});