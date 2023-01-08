import middy from "@middy/core";
import inputOutputLogger from "@middy/input-output-logger";
import httpJSONBodyParser from "@middy/http-json-body-parser";
import { Handler } from "aws-lambda";

export const withLambdaStandard = <E, R>(handler: Handler<E, R>) => {
	return (
		middy(handler)
			.use(httpJSONBodyParser())
			.use(inputOutputLogger())
	);
};
