import { withLambdaIOStandard } from "../../../../shared/typescript/hofs/with-lambda-io-standard";
import { Delete } from "../../../../shared/typescript/io/types/user";
import { CommonIOHandler } from "../../../../shared/typescript/middleware/common-lambda-io/types";
import { User } from "../../framework";

const handler: CommonIOHandler<Delete, string> = async event => {

	for(const input of event.inputs) {
		
		// TODO: send DELETE input to authentication topic.

		const user = new User(input.payload);
		await user.discontinue()
	
	}

	return `User${event.inputs.length > 1 ? "s were" : " was"} deleted successfully`;

};

export const main = withLambdaIOStandard(handler);