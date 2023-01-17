import middy from "@middy/core";
import { chance } from "../../utilities/constants";
import { errorResponse } from "../error-response";
import { withErrorResponse } from "../../hofs/with-output-response";

describe("Error Response", () => {

	const withMiddleware = (lambda: any) => middy(lambda).use(errorResponse());

	it("Returns an ErrorResponse on error", async () => {

		const lambda = withMiddleware(() => {
			throw new Error();
		});

		const response = await lambda({} as any, {} as any);
		expect(response.__typename).toBe("ErrorResponse");

	});
	
});

describe("WithErrorResponse", () => {
	
	test("with exception", async () => {
		const response = await withErrorResponse(async () => { throw new Error("Error"); });
		expect(response.__typename).toBe("ErrorResponse");
	});

	test("without exception", async () => {
		let expectedResponse = chance.string();
		const response = await withErrorResponse(async () => expectedResponse);
		expect(response).toBe(expectedResponse);
	});

});