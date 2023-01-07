import { errorResponse } from "../middleware/error-response";
import { AppSyncResolverHandler } from "aws-lambda";
import { withLambdaStandard } from "./with-lambda-standard";

export const withResolverStandard = <A, R>(resolver: AppSyncResolverHandler<A, R>) => {
	return (
		withLambdaStandard(resolver)
			.use(errorResponse<A,R>())
	);
};
