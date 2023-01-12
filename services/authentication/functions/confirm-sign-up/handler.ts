import { PostConfirmationTriggerHandler } from "aws-lambda";
import { withLambdaStandard } from "../../../../shared/typescript/hofs/with-lambda-standard";
import { ServiceIO } from "../../../../shared/typescript/io";
import { EntityType } from "../../../../shared/typescript/types/api";

const handler: PostConfirmationTriggerHandler = async event => {

	// extract attributes from event
	const { email, name } = event.request.userAttributes;
	const id = event.userName;

	// send CREATE message to user topic.
	await ServiceIO.user.create({ id, email, name, creatorType: EntityType.User, creator: id });

	return event;

};

export const main = withLambdaStandard(handler);