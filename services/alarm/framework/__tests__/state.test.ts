import { pickRandomAttributesFromObject } from "../../../../shared/typescript/utilities/functions";
import { Given, Then } from "../../../../shared/typescript/utilities/testing";
import { Alarm } from "../alarm";
import { AlarmNotFoundError } from "../errors/alarm-not-found";
import { InsufficientAttributeToCreateAlarm } from "../errors/insufficient-attributes-to-create-alarm";
import { Absolute, Null, Semi } from "../states";

// TODO: Refactor, lot of repitition.

describe("Null.", () => {

  test("State is null when it is supposed to be null", () => {
    const alarm = new Alarm({ id: "ID" });
    expect(alarm.state).toBeInstanceOf(Null);
  });

  test("Put", async () => {
    try {
      const alarm = new Alarm({ id: "ID" });
      await alarm.put();
      throw new Error("Expecting put to fail and throw InsufficientAttributeToCreateAlarm error.");
    } catch (error: any) {
      expect(error).toBeInstanceOf(InsufficientAttributeToCreateAlarm);
    }
  });

  test("Sync when the alarm does not exist", async () => {

    try {
      const alarm = new Alarm({ id: "Some non existent alarm id." });
      await alarm.sync();
      throw new Error("Expecting sync to fail and throw AlarmNotFoundError.")
    } catch (error: any) {
      expect(error).toBeInstanceOf(AlarmNotFoundError);
    }

  });

  test("Sync when Alarm exists", async () => {

    const attributes = await Given.alarm.new(); // create random alarm
    const alarm = new Alarm({ id: attributes.id });
    await alarm.sync();
    Then(attributes).alarm(alarm.attributes.valid());

  });

  test("graphQlEntity", async () => {

    const attributes = await Given.alarm.new();
    const alarm = new Alarm({ id: attributes.id });
    const graphQlEntity = await alarm.graphQlEntity();

    expect(alarm.state).toBeInstanceOf(Absolute);
    Then(attributes).alarm(graphQlEntity.alarm);

  });

});

describe("Semi.", () => {

  test("State is semi when it is supposed to be semi", () => {
    const alarm = new Alarm({ id: "ID", name: "NAME" });
    expect(alarm.state).toBeInstanceOf(Semi);
  });

  test("Put", async () => {
    try {
      const alarm = new Alarm({ id: "ID", name: "NAME" });
      await alarm.put();
      throw new Error("Expecting put to fail and throw InsufficientAttributeToCreateAlarm error.");
    } catch (error: any) {
      expect(error).toBeInstanceOf(InsufficientAttributeToCreateAlarm);
    }
  });

  test("Sync when the alarm does not exist", async () => {
    try {
      const alarm = new Alarm({ id: "Some non existent alarm id.", name: "ALARM" });
      await alarm.sync();
      throw new Error("Expecting sync to fail and throw AlarmNotFoundError.")
    } catch (error: any) {
      expect(error).toBeInstanceOf(AlarmNotFoundError);
    }
  });

  test("Sync when alarm exists", async () => {

    const { id, ...rest } = await Given.alarm.new(); // create random alarm

    const input = Given.alarm.input();
    const attributes = pickRandomAttributesFromObject(input); // get random attributes from the alarm input

    const alarm = new Alarm({ id, ...attributes });

    expect(alarm.state).toBeInstanceOf(Semi);

    await alarm.sync();

    const postEditAttributes = {
      ...rest,
      ...attributes,
      id,
      modified: alarm.attributes.get("modified")
    }

    expect(postEditAttributes).toMatchObject(alarm.attributes.valid());

  });

  test("graphQlEntity", async () => {

    const attributes = await Given.alarm.new();
    const alarm = new Alarm({ id: attributes.id });
    const graphQlEntity = await alarm.graphQlEntity();

    expect(alarm.state).toBeInstanceOf(Absolute);
    Then(attributes).alarm(graphQlEntity.alarm);

  });

});

describe("Absolute", () => {

  test("State is absolute when it is supposed to be absolute", () => {
    const alarm = new Alarm(Given.alarm.attributes());
    expect(alarm.state).toBeInstanceOf(Absolute);
  });

  test("Put", async () => {

    const alarm = new Alarm(Given.alarm.attributes());
    await alarm.put(); // insert alarm record into the table

    const postCreationRecord = await Given.alarm.byId(alarm.attributes.get("id")); // get alarm record from the table
    expect(postCreationRecord).toMatchObject(alarm.attributes.collective()); // test inserted attributes against entity attributes.

  });


  test("Sync when the alarm does not exist", async () => {
    try {
      const alarm = new Alarm(Given.alarm.attributes());
      await alarm.sync();
      throw new Error("Expecting sync to fail and throw AlarmNotFoundError.")
    } catch (error: any) {
      expect(error).toBeInstanceOf(AlarmNotFoundError);
    }
  });


  test("Sync when alarm exists", async () => {

    const { id, ...rest } = await Given.alarm.new(); // create random alarm
    const attributes = Given.alarm.input();

    const alarm = new Alarm({ id, ...attributes });

    expect(alarm.state).toBeInstanceOf(Absolute);

    await alarm.sync();

    const postEditAttributes = {
      ...rest,
      ...attributes,
      id,
      modified: alarm.attributes.get("modified")
    }

    expect(postEditAttributes).toMatchObject(alarm.attributes.valid());

  });

  test("graphQlEntity", async () => {

    const attributes = Given.alarm.attributes();
    const alarm = new Alarm(attributes);

    expect(alarm.state).toBeInstanceOf(Absolute);

    Then((await alarm.graphQlEntity()).alarm).alarm(attributes);

  });

});