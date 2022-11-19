import { AppSyncResolverHandler } from "aws-lambda";
import middy from "@middy/core";
import inputOutputLogger from '@middy/input-output-logger';
import { withErrorResponse } from "@middleware/with-error-response";
import { withLambdaStandard } from "./with-lambda-standard";

export const withResolverStandard = <A, R>(resolver: AppSyncResolverHandler<A, R>) => {
	return (
		withLambdaStandard(resolver)
			.use(withErrorResponse())
	);
};
