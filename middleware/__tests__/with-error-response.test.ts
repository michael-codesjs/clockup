import { ErrorTypes } from "@local-types/api";
import middy from "@middy/core";
import { EntityErrorMessages } from "../../framework/entities/types";
import { ZodError } from "zod";
import { withErrorResponse } from "../with-error-response";

describe("With Error Response", () => {

	const withMiddleware = (lambda: any) => middy(lambda).use(withErrorResponse());

	test("Malfomred Input Error", async () => {

		const lambda = withMiddleware(() => {
			throw new ZodError([]);
		});

		const lambda1 = withMiddleware(() => {
			throw new Error("The conditional request failed");
		});

		const response = await lambda({} as any, {} as any);
		expect(response).toMatchObject({
			__typename: "ErrorResponse",
			type: ErrorTypes.MalfomedInput
		});

		const response1 = await lambda1({} as any, {} as any);
		expect(response1).toMatchObject({
			__typename: "ErrorResponse",
			type: ErrorTypes.MalfomedInput
		});


	});

	test("User Not Found Error", async () => {

		const lambda = withMiddleware(() => {
			throw new Error(EntityErrorMessages.USER_NOT_FOUND);
		});

		const lambda1 = withMiddleware(() => {
			throw new Error("User does not exist.");
		});

		const response = await lambda({} as any, {} as any);
		expect(response).toMatchObject({
			__typename: "ErrorResponse",
			type: ErrorTypes.NotFound,
			message: EntityErrorMessages.USER_NOT_FOUND
		});

		const response1 = await lambda1({} as any, {} as any);
		expect(response1).toMatchObject({
			__typename: "ErrorResponse",
			type: ErrorTypes.NotFound
		});


	});

});