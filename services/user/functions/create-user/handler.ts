import { SNSHandler } from "aws-lambda";
import { withLambdaStandard } from "../../../../shared/typescript/hofs/with-lambda-standard";
import { Create } from "../../../../shared/typescript/io/types/user";
import { User } from "../../framework";

const handler: SNSHandler = async event => {

	for(const record of event.Records) {

		const parsed = JSON.parse(record.Sns.Message) as Create;
		const payload = parsed.payload;

		const user = new User(payload);
		await user.put(); // insert user record into the table
		
	}

};

export const main = withLambdaStandard(handler);