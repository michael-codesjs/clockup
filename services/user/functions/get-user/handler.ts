import { withCommonInput } from "../../../../shared/typescript/hofs";
import { withLambdaIOStandard } from "../../../../shared/typescript/hofs/with-lambda-io-standard";
import { withOutputResponse } from "../../../../shared/typescript/hofs/with-output-response";
import { GET, GOT, Inputs } from "../../../../shared/typescript/io/types/user";
import { CommonIOHandler } from "../../../../shared/typescript/middleware/common-lambda-io/types";
import { User } from "../../framework";

const handler: CommonIOHandler<GET, GOT> = withCommonInput(async input => {

	const getUser = async (): Promise<GOT> => {
		
		const user = new User({ id: input.payload.id }); // instantiate new User instance.
		await user.sync(); // fetch user details from the table.
		
		return {
			type: Inputs.GOT,
			correlationId: input.correlationId,
			payload: await user.graphQlEntity()
		}; // return 'GOT' input.

	}

	return withOutputResponse(getUser, { rethrow: true });

});

export const main = withLambdaIOStandard(handler);