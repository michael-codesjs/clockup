import { PostConfirmationTriggerHandler } from "aws-lambda";
import { withLambdaStandard } from "../../../../shared/typescript/hofs/with-lambda-standard";
import { Topics } from "../../../../shared/typescript/lib/sns";

const handler: PostConfirmationTriggerHandler = async event => {

	// extract attributes from event
	const { email, name } = event.request.userAttributes;
	const id = event.userName;

	// send CREATE message to user topic.
	await Topics.user.create({ id, email, name });

};

export const main = withLambdaStandard(handler);