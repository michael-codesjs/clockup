import { Given } from "@utilities/testing";
import { UserEntityFactory } from "../user";


describe("UserEntityGroup Functionality Tests", () => {


	it("Partial Attribute Put Fails", async () => {
		const { name } = Given.user.attributes();
		const user = UserEntityFactory.createEntity({ name });
		try {
			await user.put();
			expect(true).toBe(false);
		} catch (error) {
			expect(error.message).toBe("Insufficient attributes provided for record creation.");
		}
	});

	it("Partial Attribute Update Does Not Nullify Exisiting Attributes In The Table", async () => {
		const preEditAttributes = (await Given.user.authenticated())!;
		const { id } = preEditAttributes;
		const { name } = Given.user.attributes();
		const instance = await UserEntityFactory
			.createEntity({ id, name })
			.sync();
		const postEditAttributes = instance.attributes();
		expect(postEditAttributes).toMatchObject({
			...preEditAttributes,
			name,
			modified: postEditAttributes.modified,
		});
	});

});