import middy from "@middy/core";
import { withErrorResponse } from "../with-error-response";

describe("With Error Response", () => {

	const withMiddleware = (lambda: any) => middy(lambda).use(withErrorResponse());

	it("Returns an ErrorResponse on error", async () => {

		const lambda = withMiddleware(() => {
			throw new Error();
		});

		const response = await lambda({} as any, {} as any);
		expect(response.__typename).toBe("ErrorResponse");

	});
	
});