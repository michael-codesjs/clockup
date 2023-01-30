import { Given, HandlerArguments, Repeat } from "../../../../shared/typescript/utilities/testing";
import { main } from "../../functions/confirm-sign-up/handler";

describe("Confirm Sign Up", () => {

	let attributes: ReturnType<typeof Given.user.attributes>;

	beforeEach(() => {
		attributes = Given.user.attributes();
	});

	it("Sends 'CREATE' input to the user service which then creates the user.", async () => {

		const { event, context } = HandlerArguments.cognito.confirmSignUp(attributes); // event payload for confirmUserSignUp lambda handler

		await main(event, context); // call lambda

		const isCreated = await Repeat.timedOnCondition({
			times: 20,
			duration: 200,
			call: async () => { // check if the user was created in table.
				const user = await Given.user.byId(attributes.id); // get user item
				return user !== null || user !== undefined;
			}
		});

		expect(isCreated).toBe(true);

	});

});