import Entities from "@entities";
import { User } from "@local-types/api";
import { Given, HandlerArguments, Then } from "@utilities/testing";
import { handler } from "../../functions/get-profile";

describe("Get User", () => {

	it("Gets a users profile", async () => {

		const user = await Given.user.random();

		const { event, context } = HandlerArguments.user.get(user.id); // get payload for handler

		const lambdaResponse = await handler(event, context, () => {});
		const instance = Entities.User(user);

		Then.user_VS_user(lambdaResponse as User,instance.graphQlEntity());

	});

});