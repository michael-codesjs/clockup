import { withCommonInput } from "../../../../shared/typescript/hofs";
import { withLambdaIOStandard } from "../../../../shared/typescript/hofs/with-lambda-io-standard";
import { withOutputResponse } from "../../../../shared/typescript/hofs/with-output-response";
import { Continue } from "../../../../shared/typescript/io/types/user";
import { CommonIOHandler } from "../../../../shared/typescript/middleware/common-lambda-io/types";
import { OperationResponse } from "../../../../shared/typescript/types/api";
import { User } from "../../framework";

/** handler for the 'discontinueUser' lambda function. */
const handler: CommonIOHandler<Continue, OperationResponse> = withCommonInput(async input => {

	const discontinueUser = async () => {
		const user = new User(input); // instanciate instance of User with inputs from event.
		await user.discontinue(); // discontinue user.
		return `User(${input.id}) discontinued successfully.`;
	}

	return withOutputResponse(discontinueUser, { rethrow: true });

});

/** 'discontinueUser' lambda function wrapped with required middlware */
export const main = withLambdaIOStandard(handler);