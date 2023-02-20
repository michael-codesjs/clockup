import { withCommonInput } from "../../../../shared/typescript/hofs";
import { withLambdaIOStandard } from "../../../../shared/typescript/hofs/with-lambda-io-standard";
import { DISCONTINUE, DISCONTINUED, Inputs } from "../../../../shared/typescript/io/types/user";
import { CommonIOHandler } from "../../../../shared/typescript/middleware/common-lambda-io/types";
import { elseException } from "../../../../shared/typescript/utilities/functions";
import { User } from "../../framework";

/** handler for the 'discontinueUser' lambda function. */
const handler: CommonIOHandler<DISCONTINUE, DISCONTINUED> = withCommonInput(async input => {

	const responsePaylaod: DISCONTINUED["payload"] = {
		success: true,
		payload: input.payload
	};

	const discontinueUser = async () => {
		const user = new User(input.payload); // instanciate instance of User with inputs from event.
		await user.discontinue(); // discontinue user.
	}

	await elseException(discontinueUser, () => {
		responsePaylaod.success = false;
	});

	return {
		type: Inputs.DISCONTINUED,
		correlationId: input.correlationId,
		payload: responsePaylaod,
		meta: {
			propagate: true,
			source: "clockup.user.functions.discontinue-user"
		}
	};

});

/** 'discontinueUser' lambda function wrapped with required middlware */
export const main = withLambdaIOStandard(handler);