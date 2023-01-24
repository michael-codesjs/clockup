import { PreSignUpTriggerHandler } from "aws-lambda";
import { withLambdaStandard } from "../../../../shared/typescript/hofs/with-lambda-standard";

export const handler: PreSignUpTriggerHandler = async event => {
	event.response.autoConfirmUser = true;
	event.response.autoVerifyEmail = true;
	return event;
};

export const main = withLambdaStandard(handler);