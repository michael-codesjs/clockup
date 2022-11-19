
import Entities from "@entities";
import { MutationUpdateUserArgs, UpdateUserInputSchema, User } from "@local-types/api";
import { AppSyncIdentityCognito, AppSyncResolverHandler } from "aws-lambda";
import { withResolverStandard } from "@hofs/with-resolver-standard";

const main: AppSyncResolverHandler<MutationUpdateUserArgs, User> = async (event) => {

	const { sub } = event.identity as AppSyncIdentityCognito;
	const { email, name } = UpdateUserInputSchema().parse(event.arguments.input);;

	let user = Entities.User({ id: sub, email, name });
	await user.syncCognito(); // update cognito first
	user = await user.sync();

	return user.graphQlEntity();

};

export const handler = withResolverStandard(main);