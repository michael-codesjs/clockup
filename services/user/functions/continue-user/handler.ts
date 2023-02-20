import { withCommonInput } from "../../../../shared/typescript/hofs";
import { withLambdaIOStandard } from "../../../../shared/typescript/hofs/with-lambda-io-standard";
import { withOutputResponse } from "../../../../shared/typescript/hofs/with-output-response";
import { CONTINUE, CONTINUED, Inputs } from "../../../../shared/typescript/io/types/user";
import { CommonIOHandler } from "../../../../shared/typescript/middleware/common-lambda-io/types";
import { User } from "../../framework";

/** handler for the 'continueUser' lambda function. */
const handler: CommonIOHandler<CONTINUE, CONTINUED> = withCommonInput(async input => {

	const discontinueUser = async () => {
			const user = new User(input.payload); // instanciate instance of User with inputs from event.
			await user.continue(); // discontinue user.
			return `User(${input.payload.id}) continued successfully.`;
	}

	const response = await withOutputResponse(discontinueUser);

	return {
		type: Inputs.CONTINUED,
		correlationId: input.correlationId,
		payload: response,
		meta: {
			propagate: true,
			source: "clockup.user.functions.continue-user"
		}
	};

});

/** 'continueUser' lambda function wrapped with required middlware */
export const main = withLambdaIOStandard(handler);