import { withCommonInput } from "../../../../shared/typescript/hofs";
import { withLambdaIOStandard } from "../../../../shared/typescript/hofs/with-lambda-io-standard";
import { ServiceIO } from "../../../../shared/typescript/io";
import { CREATABLES_CLEANED_UP } from "../../../../shared/typescript/io/types/user";
import { CommonIOHandler } from "../../../../shared/typescript/middleware/common-lambda-io/types";

/** handler for the 'handleUserCreatablesCleanUpResponse' lambda function. */
const handler: CommonIOHandler<CREATABLES_CLEANED_UP, CREATABLES_CLEANED_UP> = withCommonInput(async input => {

	const response = input.payload;
	const correlationId = input.correlationId;
	const source = "clockup.user.functions.handle-user-creatables-cleanup-response";

	if (response.success) {

		if(input.meta.towards === "USER_DELETION") await ServiceIO.user.discontinue({
			source,
			correlationId,
			payload: response.payload
		});

	} else {

		await ServiceIO.user.deletionSettled({
			source,
			correlationId,
			payload: {
				success: false,
				payload: response.payload
			}
		})

	}

	return input;

});

/** 'handleUserCreatablesCleanUpResponse' lambda function wrapped with required middlware */
export const main = withLambdaIOStandard(handler);