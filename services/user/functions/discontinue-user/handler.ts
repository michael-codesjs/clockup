import { withCommonInput } from "../../../../shared/typescript/hofs";
import { withLambdaIOStandard } from "../../../../shared/typescript/hofs/with-lambda-io-standard";
import { Delete } from "../../../../shared/typescript/io/types/user";
import { CommonIOHandler } from "../../../../shared/typescript/middleware/common-lambda-io/types";
import { withOutputResponse } from "../../../../shared/typescript/hofs/with-output-response";
import { OperationOutput } from "../../../../shared/typescript/types/api";
import { User } from "../../framework";

/** handler for the 'discontinueUser' lambda function. */
const handler: CommonIOHandler<Delete, OperationOutput> = (
	withCommonInput(async input => {
		return await withOutputResponse(async () => {
			const user = new User(input); // instanciate instance of User with inputs from event.
			await user.discontinue(); // discontinue user.
			return "User discontinued successfully";
		});
	})
);

/** 'discontinueUser' lambda function wrapped with required middlware */
export const main = withLambdaIOStandard(handler);