import { EntityType } from "../../../../shared/typescript/types/api";
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
		expect(cognitoAttributes).toContain("name");
		expect(cognitoAttributes).toContain("email");
	});

	test("UserAttributes.parse && UserAttributes.collective", () => {

		const id = "ID", name = "name", email = "email", alarms = 10;
		attributes.parse({ ...attributes.valid(), id, name, email, alarms });

		expect(attributes.collective()).toMatchObject({
			id, name, email, alarms, entityType: EntityType.User
		});
    
	});

});