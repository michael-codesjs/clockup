import { withCommonInput } from "../../../../shared/typescript/hofs";
import { withLambdaIOStandard } from "../../../../shared/typescript/hofs/with-lambda-io-standard";
import { ServiceIO } from "../../../../shared/typescript/io";
import { DISCONTINUED } from "../../../../shared/typescript/io/types/user";
import { CommonIOHandler } from "../../../../shared/typescript/middleware/common-lambda-io/types";

/** handler for the 'handleDiscontinueUserResponse' lambda function. */
const handler: CommonIOHandler<DISCONTINUED, DISCONTINUED> = withCommonInput(async input => {

	const response = input.payload;
	const correlationId = input.correlationId;
	const source = "clockup.user.functions.handle-discontinue-user-response";

	if (response.success) { // discontinue was successful, now delete the user from cognito.

		await ServiceIO.authentication.delete({
			source,
			correlationId,
			payload: {
				id: response.payload.id
			}
		});

	} else {

		await ServiceIO.user.deletionSettled({
			correlationId,
			source,
			payload: {
				success: false,
				payload: response.payload
			}
		});

	}

	return input;

});

/** 'handleDiscontinueUserResponse' lambda function wrapped with required middlware */
export const main = withLambdaIOStandard(handler);