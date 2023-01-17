import { withLambdaIOStandard } from "../../../../shared/typescript/hofs/with-lambda-io-standard";
import { Create } from "../../../../shared/typescript/io/types/user";
import { CommonIOHandler } from "../../../../shared/typescript/middleware/common-lambda-io/types";
import { withOutputResponse } from "../../../../shared/typescript/hofs/with-output-response";
import { withCommonInput } from "../../../../shared/typescript/hofs";
import { User as UserGraphQlEntity, ErrorResponse as ErrorResponseGraphQLEntity } from "../../../../shared/typescript/types/api";
import { User } from "../../framework";

/** handler for the 'createUser' lambda function. */
const handler: CommonIOHandler<Create, UserGraphQlEntity | ErrorResponseGraphQLEntity> = (
	withCommonInput(async input => {
		return await withOutputResponse(async () => {
			const user = new User({ ...input, alarms: 0 }); // instanciate instance of User with inputs from event + { alarms: 0 }
			await user.put(); // insert user record into the 'User' entity table.
			return await user.graphQlEntity(); // return the created users GraphQL Entity.
		});
	})
);

/** 'createUser' lambda function handler wrapped in it's required middleware. */
export const main = withLambdaIOStandard(handler);