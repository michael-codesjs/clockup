
import Entities from "@entities";
import { MutationUpdateUserArgs, UpdateUserInputSchema as validator, User } from "@local-types/api";
import { AppSyncIdentityCognito, AppSyncResolverHandler } from "aws-lambda";
import { withResolverStandard } from "@hofs/with-resolver-standard";
import { zodInputValidator } from "@middleware/yup-input-validator";

const main: AppSyncResolverHandler<MutationUpdateUserArgs, User> = async (event) => {

	const { sub } = event.identity as AppSyncIdentityCognito;
	const { email, name } = event.arguments.input;

	let user = Entities.User({ id: sub, email, name });
	await user.syncCognito(); // update cognito
	user = await user.sync(); // update dynamodb table

	return user.graphQlEntity();

};

export const handler = (
	withResolverStandard(main)
	.use(zodInputValidator(validator))
);