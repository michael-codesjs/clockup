import middy from "@middy/core";
import { Context } from "aws-lambda";
import { commonLambdaIO } from "../middleware";
import { CommonIOHandler, CommonIOInputSources } from "../middleware/common-lambda-io/types";
import { withLambdaStandard } from "./with-lambda-standard";

export const withLambdaIOStandard = <I, R>(handler: CommonIOHandler<I, R>) => {

	return (
		(withLambdaStandard(handler) as unknown as middy.MiddyfiedHandler<CommonIOInputSources<I, R>, R, Error, Context>)
			.use(commonLambdaIO())
	)

};
