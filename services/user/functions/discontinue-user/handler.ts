import { withLambdaIOStandard } from "../../../../shared/typescript/hofs/with-lambda-io-standard";
import { Delete } from "../../../../shared/typescript/io/types/user";
import { CommonIOHandler } from "../../../../shared/typescript/middleware/common-lambda-io/types";
import { withErrorResponse } from "../../../../shared/typescript/middleware/error-response/with-error-response";
import { ErrorResponse } from "../../../../shared/typescript/types/api";
import { User } from "../../framework";

const handler: CommonIOHandler<Delete, Array<ErrorResponse | string>> = async event => {

	console.log("Event:", event);
	/*

	const responses: Array<ErrorResponse | string> = [];

	for (const input of event.inputs) {
		
		const response = await withErrorResponse(async () => {
			const user = new User(input.payload);
			await user.discontinue(); // delete(discontinue) user
			return "User discontinued succesfully";
		});

		responses.push(response);
	
	}

	return responses;

	*/

	return [] as any;

};

export const main = withLambdaIOStandard(handler);