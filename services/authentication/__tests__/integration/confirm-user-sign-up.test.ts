import { Given, HandlerArguments, Then } from "@utilities/testing";
import { handler } from "../../functions/confirm-user-sign-up";

describe("confirm-user-sign-up", () => {

	it("confirms the user signs-up", async () => {

		const attributes = Given.user.attributes(); // get random user attributes
		const { event } = HandlerArguments.cognito.confirmSignUp(attributes); // event payload for confirmUserSignUp lambda handler

		await handler(event);

		const dbRecord = await Given.user.byId(attributes.id); // fetch user record created via our lambda

		Then.user(dbRecord,attributes); // test recorded attributes against generated ones

	});

});