import { Error as CustomError } from "../../abstracts/error";
import { ErrorTypes } from "../../types/api";
import { chance } from "../../utilities/constants";
import { withOutputResponse } from "../with-output-response";

describe("withOutputResponse", () => {

	test("With exception", async () => {
		const response = await withOutputResponse(async () => { throw new Error("Error"); });
		expect(response.__typename).toBe("ErrorResponse");
	});

	test("Without exception", async () => {
		let expectedResponse = {
			[chance.word()]: chance.string()
		}
		const response = await withOutputResponse(async () => expectedResponse);
		expect(response).toMatchObject(expectedResponse);
	});

	test("Rethrows Error", async () => {
		try {
			await withOutputResponse(async () => { throw new Error("error") }, { rethrow: true });
			throw new Error("Expecting withOutputResponse to rethrow a new ErrorResponse.");
		} catch (error: any) {
			expect(error.name).toBe(ErrorTypes.InternalError);
			expect(error.message).toBe("Something went wrong.");
		}
	});

	test("Rethrows CustomError as ErrorResponse", async () => {
		try {
			await withOutputResponse(async () => { throw new CustomError("CustomError.") }, { rethrow: true });
			throw new Error("Expecting withOutputResponse to rethrow the ErrorResponse.");
		} catch (error: any) {
			expect(error.name).toBe(ErrorTypes.InternalError);
			expect(error.message).toBe("CustomError.");
		}
	});

	test("With operation response", async () => {
		const expectedResponse = chance.string();
		const response = await withOutputResponse(async () => expectedResponse);
		expect(response).toMatchObject({
			__typename: "OperationResponse",
			message: expectedResponse
		});
	});

});