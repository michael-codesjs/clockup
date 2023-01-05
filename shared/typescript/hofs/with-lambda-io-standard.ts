import { Handler } from "aws-lambda";
import { withErrorResponse } from "../middleware";
import { commonLambdaIO } from "../middleware/common-lambda-io";
import { withLambdaStandard } from "./with-lambda-standard";

export const withLambdaIOStandard = <H extends Handler>(handler: H) => {
	return (
		withLambdaStandard(handler)
			.use(commonLambdaIO())
			.use(withErrorResponse())
	);
};
