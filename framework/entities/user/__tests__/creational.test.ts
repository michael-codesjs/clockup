
import { chance } from "../../../../utilities/constants";
import { Given, Then } from "../../../../utilities/testing";
import { EntityErrorMessages } from "../../types";
import { UserFactory } from "../index";

describe("UserEntityGroup Creational Tests", () => {

	it("Creates UserEntityGroup.NullUser", () => {
		const id = chance.guid();
		const user = UserFactory.createEntity({ id: id  });
		expect(user.TypeOfSelf).toBe(user.NullTypeOfSelf);
		expect(user.graphQlEntity()).toBe(null);
	});

	it("Creates UserEntityGroup.User", () => {
		const { name, email, id } = Given.user.attributes();
		const user = UserFactory.createEntity({ name, email, id });
		expect(user.TypeOfSelf).toBe(user.AbsoluteTypeOfSelf);
		expect(user.attributes.collective()).toMatchObject({
			email, name, id, alarms: 0
		});
	});

	it("Create UserEntityGroup.User from UserEntityGroup.NullUser", async () => {
		const attributes = (await Given.user.random())!; // create random user
		const user = await UserFactory.createEntity({ id: attributes.id  }).sync();
		expect(user.TypeOfSelf).toBe(user.AbsoluteTypeOfSelf);
		Then.user_VS_user(user.attributes.collective(), attributes);
	});

	it("Fails when UserEntityGroup.NullUser is given an id for a user that does not exist with the right EntityErrorMessage", async () => {
		const user = UserFactory.createEntity({ id: "Some Non Existent User Id0000000" });
		try {
			await user.sync();
			throw new Error("Expecting operation user.sync to fail");
		} catch (error: any) {
			expect(error.message).toBe(EntityErrorMessages.USER_NOT_FOUND);
		}
	});

});