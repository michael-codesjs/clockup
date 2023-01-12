import { withLambdaIOStandard } from "../../../../shared/typescript/hofs/with-lambda-io-standard";
import { Create } from "../../../../shared/typescript/io/types/user";
import { CommonIOHandler } from "../../../../shared/typescript/middleware/common-lambda-io/types";
import { withErrorResponse } from "../../../../shared/typescript/middleware/error-response/with-error-response";
import { User as UserGraphQlEntity, ErrorResponse as ErrorResponseGraphQLEntity } from "../../../../shared/typescript/types/api";
import { User } from "../../framework";

const handler: CommonIOHandler<Create, Array<UserGraphQlEntity | ErrorResponseGraphQLEntity>> = async event => {

	const responses: Array<UserGraphQlEntity | ErrorResponseGraphQLEntity> = [];

	for (const input of event.inputs) {

		const response = await withErrorResponse(async () => {
			const payload = { ...input, alarms: 0 };
			console.log("CRU Payload:", payload);
			const user = new User(payload);
			await user.put();
			const graphQlEntity = await user.graphQlEntity();
			console.log("CRU GRQLE:", graphQlEntity);
			return graphQlEntity;
		});

		responses.push(response);

	}

	return responses;

};

export const main = withLambdaIOStandard(handler);