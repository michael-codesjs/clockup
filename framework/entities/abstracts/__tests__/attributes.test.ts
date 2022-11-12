import { Attributes as AbstractAttributes } from "../attributes";
import { EntityType } from "../../../../types/api";
import { Then } from "../../../../utilities/testing/then";

class Attributes extends AbstractAttributes { } // class we can instanciate

describe("Attributes", () => {

  test("Base attributes", () => {
    const attributes = new Attributes({ entityType: EntityType.User, id: "ID" });
    expect(attributes.collective()).toMatchObject({
      entityType: EntityType.User,
      id: "ID",
      created: Then.dateMatch(),
      modified: null,
      discontinued: false
    });
  });

  test("Explicit base attributes", () => {
    const attributes = new Attributes({
      entityType: EntityType.User,
      id: "ID",
      created: new Date().toJSON(),
      modified: new Date().toJSON(),
      discontinued: true
    });
    expect(attributes.collective()).toMatchObject({
      entityType: EntityType.User,
      id: "ID",
      created: Then.dateMatch(),
      modified: Then.dateMatch(),
      discontinued: true
    });
  });

  test("Attributes.get", () => {

    const values = { entityType: EntityType.User, id: "ID", created: new Date().toJSON(), modified: new Date().toJSON(), discontinued: true };
    const attributes = new Attributes(values);

    for(const key in values) {
      expect(attributes.get(key)).toBe(values[key]);
    }

  });

  test("Attributes.set", () => {
    
    const attributes = new Attributes({ entityType: EntityType.Alarm, id: "ID" });
    
    attributes.set({
      created: new Date().toJSON(),
      discontinued: true,
    });

    expect(attributes.collective()).toMatchObject({
      created: Then.dateMatch(),
      modified: Then.dateMatch(),
      discontinued: true,
    });

  });

  test("Attributes.set is ineffective on entityType and id", () => {
      
    const attributes = new Attributes({ entityType: EntityType.User, id: "ID" });
    
    attributes.set({
      entityType: EntityType.Alarm,
      id: "Id"
    } as any);

    expect(attributes.collective()).toMatchObject({
      entityType: EntityType.User,
      id: "ID"
    });
    
  });

  test("Attributes.putable", () => {
    const attributes = new Attributes({ entityType: EntityType.User });
    expect(attributes.putable()).toBe(true);
  });

});