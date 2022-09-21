import { AppSyncIdentityCognito, AppSyncResolverEvent } from "aws-lambda";
import { configureEnviromentVariables } from "@utilities/functions";
import Entities from "@entities";

configureEnviromentVariables();

export const handler = async (event:AppSyncResolverEvent<null>) => {

	const { sub } = event.identity as AppSyncIdentityCognito;

	const user = await ( 
		Entities
			.user({ id: sub })
			.sync()
	);

	return user.graphqlEntity();
  
};