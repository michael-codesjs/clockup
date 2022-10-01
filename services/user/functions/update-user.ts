
import { AppSyncIdentityCognito, AppSyncResolverHandler } from "aws-lambda";
import Entities from "@entities";
import { MutationUpdateUserArgs, UpdateUserInputSchema } from "@local-types/api";
import { configureEnviromentVariables } from "@utilities/functions";

configureEnviromentVariables();

export const handler: AppSyncResolverHandler<MutationUpdateUserArgs, any> = async (event) => {

	const { sub } = event.identity as AppSyncIdentityCognito;
	const { email, name } = UpdateUserInputSchema().parse(event.arguments.input);

	const user = await Entities
		.User({ id: sub, email, name })
		.sync();

	return user.graphQlEntity();

};