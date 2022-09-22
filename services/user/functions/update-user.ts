
import { AppSyncIdentityCognito, AppSyncResolverHandler } from "aws-lambda";
import Entities from "@entities";
import { MutationUpdateUserArgs } from "@local-types/api";

export const handler: AppSyncResolverHandler<MutationUpdateUserArgs,any> = async (event) => {

	const { sub } = event.identity as AppSyncIdentityCognito;
	const { email, name } = event.arguments.input!;

	const user = await (
		Entities
			.User({ id: sub, email, name  })
			.sync({ exists: true })
	);

	return user.graphqlEntity();

};