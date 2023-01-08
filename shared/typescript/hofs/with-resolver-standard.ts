import { Handler } from "aws-lambda";
import { errorResponse } from "../middleware/error-response";
import { withLambdaStandard } from "./with-lambda-standard";

export const withResolverStandard = <E, R>(resolver: Handler<E, R>) => {
	return (
		withLambdaStandard(resolver)
			.use(errorResponse<E,R>())
	);
};
