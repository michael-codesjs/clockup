import { AppSyncResolverHandler, Context } from "aws-lambda";
import { commonLambdaIO } from "../middleware";
import { CommonIOInputSources } from "../middleware/common-lambda-io/types";
import { withResolverStandard } from "./with-resolver-standard";

export const withLambdaIOStandard = <I, R>(handler: (event: CommonIOInputSources<I, R>, Context: Context) => any) => {
	return (
		withResolverStandard(handler as AppSyncResolverHandler<I, R>)
			.use(commonLambdaIO())
	);
};
