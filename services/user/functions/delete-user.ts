import Entities from "@entities";
import { withResolverStandard } from "shared/hofs/with-resolver-standard";
import { OperationResponse } from "shared/types/api";
import { AppSyncIdentityCognito, AppSyncResolverHandler } from "aws-lambda";

const main: AppSyncResolverHandler<null, OperationResponse> = async (event) => {

	const { sub } = event.identity as AppSyncIdentityCognito;

	const user = await Entities.User({ id: sub }).sync();
	await user.discontinue(); // discontinue user

	return {
		__typename: "OperationResponse",
		success: true,
		message: "User deleted successfully."
	};

};

export const handler = withResolverStandard(main);