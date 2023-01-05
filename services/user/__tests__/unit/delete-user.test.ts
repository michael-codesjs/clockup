import { ServiceIO } from "../../../../shared/typescript/io";
import { EntityType, User } from "../../../../shared/typescript/types/api";
import { Given, Repeat } from "../../../../shared/typescript/utilities/testing";

describe("Delete User", () => {

	let user: User;

	beforeEach(async () => {
		user = await Given.user.new();
	});

	it("Deletes a user", async () => {

		await ServiceIO.user.delete({
			id: user.id,
			creator: user.creator,
			creatorType: user.entityType as EntityType.User,
		});

		const result = await Repeat.timedOnCondition({
      call: async () => {
        const userRecord = await Given.user.byId(user.id); // get user record from the table
				expect(userRecord.discontinued).toBe(true);
        return true;
      },
      times: 10,
      duration: 100
    });

		expect(result).toBe(true);

	});

	test("Deleting user that was not created by initiator of delete operation fails.", async () => {

		await ServiceIO.user.delete({
			id: user.id,
			creator: "Some non existent creator ID",
			creatorType: EntityType.User
		});

		const result = await Repeat.timedOnCondition({
      call: async () => {
        const userRecord = await Given.user.byId(user.id); // get user record from the table
				return userRecord.discontinued === true ? true : false;
      },
      times: 10,
      duration: 100
    });

		expect(result).toBe(false);

	});

});