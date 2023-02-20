import { withCommonInput } from "../../../../shared/typescript/hofs";
import { withLambdaIOStandard } from "../../../../shared/typescript/hofs/with-lambda-io-standard";
import { ServiceIO } from "../../../../shared/typescript/io";
import { INITIATE_DELETE } from "../../../../shared/typescript/io/types/user";
import { CommonIOHandler } from "../../../../shared/typescript/middleware/common-lambda-io/types";
import { elseException } from "../../../../shared/typescript/utilities/functions";

/** handler for the 'initiateDeleteUser' lambda function. */
const handler: CommonIOHandler<INITIATE_DELETE, INITIATE_DELETE> = withCommonInput(async input => {

	const { correlationId, payload } = input;
	const source = "clockup.user.functions.initiate-delete-user";

	const startCreatablesCleanUp = async () => await ServiceIO.user.creatablesCleanUp({
		correlationId,
		source,
		payload,
		meta: {
			towards: "USER_DELETION"
		}
	});

	await elseException(startCreatablesCleanUp, async () => {
		await ServiceIO.user.deletionSettled({
			correlationId,
			source,
			payload: {
				success: false,
				payload
			}
		})
	});

	return input;

});

/** 'initiateDeleteUser' lambda function wrapped with required middlware. */
export const main = withLambdaIOStandard(handler);