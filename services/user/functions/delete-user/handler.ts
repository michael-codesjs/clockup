import { withLambdaIOStandard } from "../../../../shared/typescript/hofs/with-lambda-io-standard";
import { Delete } from "../../../../shared/typescript/io/types/user";
import { CommonIOHandler } from "../../../../shared/typescript/middleware/common-lambda-io/types";
import { User } from "../../framework";

const handler: CommonIOHandler<Delete, void> = async event => {

	for(const input of event.inputs) {
		const user = new User(input.payload);
		await user.discontinue(); // delete(discontinue) user
	}

};

export const main = withLambdaIOStandard(handler);