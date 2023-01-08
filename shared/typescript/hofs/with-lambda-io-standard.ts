import middy from "@middy/core";
import { Context } from "aws-lambda";
import { commonLambdaIO } from "../middleware";
import { CommonIOHandler, CommonIOInputSources } from "../middleware/common-lambda-io/types";
import { withResolverStandard } from "./with-resolver-standard";

export const withLambdaIOStandard = <I, R>(handler: CommonIOHandler<I, R>) => {

	return (
		(withResolverStandard(handler) as unknown as middy.MiddyfiedHandler<CommonIOInputSources<I, R>, R, Error, Context>)
			.use(commonLambdaIO())
	)

};
