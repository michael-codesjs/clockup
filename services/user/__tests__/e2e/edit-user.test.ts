import { Given, When } from "@utilities/testing";

jest.setTimeout(60000);

describe("Edit User Profile", () => {

	it("Edits a users profile", async () => {

		const user = await Given.entities.autheticatedUser();
		const { email, name } = await Given.attributes.user();
		const updatedProfile = await When.api.editUser({ email, name });

		expect(updatedProfile).toMatchObject({
			id: user.id,
			name: name,
			email: email,
			alarms: 0,
		});

	});

});