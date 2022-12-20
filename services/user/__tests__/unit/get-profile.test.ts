import Entities from "@entities";
import { ErrorTypes, User } from "shared/types/api";
import { Given, HandlerArguments, Then } from "@utilities/testing";
import { EntityErrorMessages } from "../../../../framework/entities/types";
import { handler } from "../../functions/get-profile";

describe("Get User", () => {

	it("Gets a users profile", async () => {

		const user = await Given.user.random();

		const { event, context } = HandlerArguments.user.get(user.id); // get payload for handler

		const lambdaResponse = await handler(event, context, () => {});
		const instance = Entities.User(user);

		Then(lambdaResponse).user(instance.graphQlEntity());

	});

	it("Fails with user not found error when trying to get a user that does not exist", async () => {
		const { event, context } = HandlerArguments.user.get("Some Non Existent User Id XD");
		const lambdaResponse = await handler(event, context, () => {});
		expect(lambdaResponse).toMatchObject({
			__typename: "ErrorResponse",
			type: ErrorTypes.NotFound,
			message: EntityErrorMessages.USER_NOT_FOUND,
		});
	});

});