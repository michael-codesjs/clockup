import { SNSHandler } from "aws-lambda";
import { withLambdaStandard } from "../../../../shared/typescript/hofs/with-lambda-standard";
import { UserCreateMessage } from "../../../../shared/typescript/types/topic-messages";

const handler: SNSHandler = async event => {

	for(const record of event.Records) {

		const parsed = JSON.parse(record.Sns.Message) as UserCreateMessage;
		const payload = parsed.payload;

		// put user to table
		
	}

};

export const main = withLambdaStandard(handler);