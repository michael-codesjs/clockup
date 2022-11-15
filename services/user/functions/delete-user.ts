import Entities from "@entities";
import { withResolverStandard } from "@hofs/with-resolver-standard";
import { OperationResponse } from "@local-types/api";
import { AppSyncIdentityCognito, AppSyncResolverHandler } from "aws-lambda";

const main: AppSyncResolverHandler<null, OperationResponse> = async (event) => {

	const { sub } = event.identity as AppSyncIdentityCognito;

	await Entities
		.User({ id: sub })
		.terminate(); // delete user

	return {
		__typename: "OperationResponse",
		success: true,
		message: "User deleted successfully."
	};

};

export const handler = withResolverStandard(main);