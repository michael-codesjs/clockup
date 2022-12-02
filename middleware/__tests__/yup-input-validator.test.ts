import { UpdateUserInputSchema } from "@local-types/api";
import { yupInputValidator } from "@middleware/yup-input-validator";
import middy from "@middy/core";
import * as yup from "yup";
import { chance } from "@utilities/constants";
import { AppSyncResolverEvent } from "aws-lambda";
import { UpdateUserMutationVariables } from "@client/types/api";

/*
 * we are not going to test each and every input validator we generate using graphql codegen.
 * we are just going to test that our middleware works.
 */

describe("With Zod Input Validator", () => {

  type input = {
    attribute: string,
    attribute1: number
  };

  const validator: () => yup.SchemaOf<input> = () => (
  	yup.object({
  		attribute: yup.string().min(5).max(10).required(),
  		attribute1: yup.number().min(1).max(10).required()
  	})
  );

  const withMiddleware = (lambda: any, validator: Parameters<typeof yupInputValidator>[0]) => middy(lambda).use(yupInputValidator(validator));

  /** generates event payload for lambdas */
  const getEvent = (attribute: string, attribute1: number) => ({
  	arguments: {
  		input: {
  			attribute, attribute1
  		}
  	}
  } as any);

  let attribute: string;
  let attribute1: number;

  const lambda = withMiddleware((event: AppSyncResolverEvent<{ input: input }>) => {
  	console.log(event.arguments.input);
  	expect(event.arguments.input).toMatchObject({
  		attribute, attribute1
  	});
  }, validator);

  beforeEach(() => {
  	attribute = chance.string({ length: 8 });
  	attribute1 = chance.integer({ min: 1, max: 10 });
  });

  it("Validates a clean input", async () => await lambda(getEvent(attribute, attribute1), {} as any));

  it("Validates a dirty input", async () => {

  	try {
  		await lambda(getEvent("", 0) as any, {} as any);
  	} catch (error: any) {
  		expect(error.name).toBe("ValidationError");
  	}

  });

});