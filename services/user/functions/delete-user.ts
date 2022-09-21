import { AppSyncIdentityCognito, AppSyncResolverHandler } from "aws-lambda";
import Entities from "@entities";

export const handler:AppSyncResolverHandler<null,any> = async (event) => {

	const { sub } = event.identity as AppSyncIdentityCognito;

	const result = await (
		Entities
			.user({ id: sub })
			.unsync()
	);

	return result;

};