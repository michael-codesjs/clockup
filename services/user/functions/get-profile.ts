import Entities from "@entities";
import type { User } from "@local-types/api";
import { configureEnviromentVariables } from "@utilities/functions";
import { AppSyncIdentityCognito, AppSyncResolverEvent, AppSyncResolverHandler } from "aws-lambda";

configureEnviromentVariables();

export const handler: AppSyncResolverHandler<null,User> = async (event: AppSyncResolverEvent<null>) => {

	const { sub } = event.identity as AppSyncIdentityCognito;

	const user = await Entities
		.User({ id: sub })
		.sync()

	return user.graphQlEntity();

};