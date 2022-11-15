import { ErrorTypes } from "@local-types/api";
import middy from "@middy/core";
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
    })

    const response = await lambda({} as any, {} as any);
    expect(response).toMatchObject({
      __typename: "ErrorResponse",
      type: ErrorTypes.MalfomedInput
    });

    const response1 = await lambda({} as any, {} as any);
    expect(response1).toMatchObject({
      __typename: "ErrorResponse",
      type: ErrorTypes.MalfomedInput
    });


  });

});