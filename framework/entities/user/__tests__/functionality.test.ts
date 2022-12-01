import { Given, Then } from "@utilities/testing";
import { UserFactory } from "../user";


describe("UserEntityGroup Functionality Tests", () => {

	test("Partial Attribute Update Does Not Nullify Exisiting Attributes In The Table", async () => {
		const preEditAttributes = (await Given.user.random())!;
		const { id } = preEditAttributes;
		const { name } = Given.user.attributes();
		const instance = await UserFactory.createEntity({ id, name }).sync();
		const postEditAttributes = instance.attributes.collective();
		Then.user_VS_user(postEditAttributes, {
			...preEditAttributes,
			name
		});
	});

});