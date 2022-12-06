import middy from "@middy/core";
import inputOutputLogger from "@middy/input-output-logger";
import httpJSONBodyParser from "@middy/http-json-body-parser";
import { Handler } from "aws-lambda";

export const withLambdaStandard = <A, R>(resolver: Handler<A, R>) => {
	return (
		middy(resolver)
			.use(inputOutputLogger())
			.use(httpJSONBodyParser())
	);
};
