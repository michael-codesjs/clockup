import { withCommonInput } from "../../../../shared/typescript/hofs";
import { withLambdaIOStandard } from "../../../../shared/typescript/hofs/with-lambda-io-standard";
import { withOutputResponse } from "../../../../shared/typescript/hofs/with-output-response";
import { CREATE, CREATED, Inputs } from "../../../../shared/typescript/io/types/user";
import { CommonIOHandler } from "../../../../shared/typescript/middleware/common-lambda-io/types";
import { User } from "../../framework";
import { ServiceIO } from "../../../../shared/typescript/io";

/** handler for the 'createUser' lambda function. */
const handler: CommonIOHandler<CREATE, CREATED> = withCommonInput(async input => {

	const createUser = async (): Promise<CREATED> => {
		
		const user = new User(input.payload); // instanciate instance of User with input payload.
		await user.put(); // insert user record into the 'User' entity table.

		const userGraphQlEntity = await user.graphQlEntity();

		await ServiceIO.user.created({
			source: "clockup.user.functions.create-user",
			correlationId: input.correlationId,
			payload: userGraphQlEntity
		}); // send 'USER_CREATED' input to event bus to be acted upon by interested services.
		
		return {
			correlationId: input.correlationId,
			type: Inputs.CREATED,
			payload: userGraphQlEntity
		}

	};

	return await withOutputResponse(createUser, { rethrow: true });

});

/** 'createUser' lambda function handler wrapped in it's required middleware. */
export const main = withLambdaIOStandard(handler);