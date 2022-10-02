import Entities from "@entities";
import type { User } from "@local-types/api";
import { configureEnviromentVariables } from "@utilities/functions";
import { AppSyncIdentityCognito, AppSyncResolverHandler } from "aws-lambda";

configureEnviromentVariables();

export const handler: AppSyncResolverHandler<null,User> = async (event) => {

	const { sub } = event.identity as AppSyncIdentityCognito;

	const user = await Entities
		.User({ id: sub })
		.sync();

	return user.graphQlEntity();

};