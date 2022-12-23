import { Given, Then } from "@utilities/testing";
import { UserFactory } from "../../../../framework/entities/user/user";

describe("UserEntityGroup Functionality Tests", () => {

	test("Partial Attribute Update Does Not Nullify Exisiting Attributes In The Table", async () => {
		const preEditAttributes = (await Given.user.random())!;
		const { id } = preEditAttributes;
		const { name } = Given.user.input();
		const instance = UserFactory.createEntity({ id, name });
		console.log("Pre:", instance.attributes.updateable());
		await instance.sync();
		const postEditAttributes = instance.attributes.collective();
		Then(postEditAttributes).user({
			...preEditAttributes,
			name
		});
	});

});