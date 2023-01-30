import { withCommonInput } from "../../../../shared/typescript/hofs";
import { withLambdaIOStandard } from "../../../../shared/typescript/hofs/with-lambda-io-standard";
import { withOutputResponse } from "../../../../shared/typescript/hofs/with-output-response";
import { CREATE, CREATED, Inputs } from "../../../../shared/typescript/io/types/user";
import { CommonIOHandler } from "../../../../shared/typescript/middleware/common-lambda-io/types";
import { User } from "../../framework";

/** handler for the 'createUser' lambda function. */
const handler: CommonIOHandler<CREATE, CREATED> = withCommonInput(async input => {

	const createUser = async (): Promise<CREATED> => {
		console.log("Create User Input Type:", typeof input);
		console.log("Create User Input:", input);
		const user = new User(input.payload); // instanciate instance of User with input payload.
		await user.put(); // insert user record into the 'User' entity table.
		return {
			cid: input.cid,
			type: Inputs.CREATED,
			payload: await user.graphQlEntity()
		}
	};

	return await withOutputResponse(createUser, { rethrow: true });

});

/** 'createUser' lambda function handler wrapped in it's required middleware. */
export const main = withLambdaIOStandard(handler);