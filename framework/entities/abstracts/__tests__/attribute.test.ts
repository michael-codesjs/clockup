import { Attribute } from "../attribute"

describe("Attribute", () => {

  let attribute: Attribute;

  beforeEach(() => {
    attribute = new Attribute({ required: true, value: "value" });
  });

  test("set value", () => {
    const secondValue = "second value";
    attribute.value = secondValue;
    expect(attribute.value).toBe(secondValue)
  });

});

describe("Required Attribute", () => {

  let attribute: Attribute;

  beforeEach(() => {
    attribute = new Attribute({ required: true, value: "value" });
  });

  test("putable", () => {
    expect(attribute.putable()).toBe(true);
  });

});

describe("Required Attributes With Validators", () => {

  let attribute: Attribute;

  beforeEach(() => {
    const validate = (value: string) => (value.length) > 3 && /a/.test(value);
    attribute = new Attribute({ required: true, value: "value", validate });
  });

  test("truthy putable", () => {
    expect(attribute.putable()).toBe(true);
  });

});