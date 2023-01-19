import { withCommonInput } from "../../../../shared/typescript/hofs";
import { withLambdaIOStandard } from "../../../../shared/typescript/hofs/with-lambda-io-standard";
import { withOutputResponse } from "../../../../shared/typescript/hofs/with-output-response";
import { Discontinue } from "../../../../shared/typescript/io/types/user";
import { CommonIOHandler } from "../../../../shared/typescript/middleware/common-lambda-io/types";
import { OperationResponse } from "../../../../shared/typescript/types/api";
import { User } from "../../framework";

/** handler for the 'continueUser' lambda function. */
const handler: CommonIOHandler<Discontinue, OperationResponse> = withCommonInput(async input => {

	const discontinueUser = async () => {
			const user = new User(input); // instanciate instance of User with inputs from event.
			await user.continue(); // discontinue user.
			return `User(${input.id}) continued successfully.`;
	}

	return withOutputResponse(discontinueUser, { rethrow: true });

});

/** 'continueUser' lambda function wrapped with required middlware */
export const main = withLambdaIOStandard(handler);