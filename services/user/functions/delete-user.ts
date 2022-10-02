import { AppSyncIdentityCognito, AppSyncResolverHandler } from "aws-lambda";
import Entities from "@entities";
import { configureEnviromentVariables } from "@utilities/functions";

configureEnviromentVariables();

export const handler:AppSyncResolverHandler<null,any> = async (event) => {

	const { sub } = event.identity as AppSyncIdentityCognito;

	const user = await Entities
		.User({ id: sub })
		.terminate(); // delete user

	return user.graphQlEntity() === null;

};