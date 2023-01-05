import { withLambdaIOStandard } from "../../../../shared/typescript/hofs/with-lambda-io-standard";
import { Create } from "../../../../shared/typescript/io/types/user";
import { CommonIOHandler } from "../../../../shared/typescript/middleware/common-lambda-io/types";
import { User } from "../../framework";

const handler: CommonIOHandler<Create, void> = async event => {

	for(const input of event.inputs) {
		const payload = { ...input.payload, alarms: 0 };
		const user = new User(payload);
		await user.put();
	}

};

export const main = withLambdaIOStandard(handler);