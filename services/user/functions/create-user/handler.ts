import { CommonIOHandler } from "../../../../shared/typescript/middleware/common-lambda-io/types";
import { withLambdaStandard } from "../../../../shared/typescript/hofs/with-lambda-standard";
import { Create } from "../../../../shared/typescript/io/types/user";
import { User } from "../../framework";
import { commonLambdaIO } from "../../../../shared/typescript/middleware/common-lambda-io";

const handler: CommonIOHandler<Create, void> = async event => {

	for(const input of event.inputs) {
		const payload = { ...input.payload, alarms: 0 };
		const user = new User(payload);
		await user.put();
	}

};

export const main = (
	withLambdaStandard(handler)
	.use(commonLambdaIO())
);