import { EntityType } from "@local-types/api";
import { UserAttributes } from "../attributes";

describe("UserAttribtues", () => {

  let attributes: UserAttributes;

  beforeEach(() => {
    attributes = new UserAttributes();
  });

  test("UserAttributes.cognito", () => {
    // check if it only returns attributes that exist in cognito
    const cognitoAttributes = Object.keys(attributes.cognito);
    expect(cognitoAttributes.length).toBe(2);
    expect(cognitoAttributes.includes("name") && cognitoAttributes.includes("email")).toBe(true);
  });

  test("UserAttributes.parse && UserAttributes.collective", () => {

    const id = "ID", name = "name", email = "email", alarms = 10;
    attributes.parse({ id, name, email, alarms });

    expect(attributes.collective()).toMatchObject({
      id, name, email, alarms, entityType: EntityType.User
    });
    
  });

});