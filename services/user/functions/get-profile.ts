import Entities from "@entities";
import type { User } from "shared/types/api";
import { AppSyncIdentityCognito, AppSyncResolverHandler } from "aws-lambda";
import { withResolverStandard } from "shared/hofs/with-resolver-standard";
import { EntityErrorMessages } from "../../../framework/entities/types";

const main: AppSyncResolverHandler<null,User> = async (event) => {

	const { sub } = event.identity as AppSyncIdentityCognito;

	const user = await Entities
		.User({ id: sub })
		.sync();

	if(!user.composable()) throw new Error(EntityErrorMessages.USER_NOT_FOUND); // user is discontinued

	return user.graphQlEntity();

};

export const handler = withResolverStandard(main);