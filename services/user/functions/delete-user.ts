import { AppSyncIdentityCognito, AppSyncResolverHandler } from "aws-lambda";
import Entities from "@entities";

export const handler:AppSyncResolverHandler<null,any> = async (event) => {

	const { sub } = event.identity as AppSyncIdentityCognito;

	const user = Entities.User({ id: sub });

	await user.unsync(); // delete user

	return user.graphqlEntity() === null;

};