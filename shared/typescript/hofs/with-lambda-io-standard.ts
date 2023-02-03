import middy from "@middy/core";
import { Context } from "aws-lambda";
import { commonLambdaIO } from "../middleware";
import { CommonIOHandler, CommonInputSources } from "../middleware/common-lambda-io/types";
import { withLambdaStandard } from "./with-lambda-standard";

export const withLambdaIOStandard = <I, R>(handler: CommonIOHandler<I, R>) => {

	const handlerWithStandard = withLambdaStandard(handler) as unknown as middy.MiddyfiedHandler<CommonInputSources<I, R>, R, Error, Context>;
	const handlerWithCommonIO = handlerWithStandard.use(commonLambdaIO());

	return handlerWithCommonIO;

};
