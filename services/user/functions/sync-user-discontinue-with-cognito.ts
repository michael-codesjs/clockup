import Entities from "@entities";
import { withLambdaStandard } from "shared/hofs/with-lambda-standard";
import { DynamoDBStreamHandler } from "aws-lambda";

const main: DynamoDBStreamHandler = async event => {

	for (const record of event.Records) {
		const id = record.dynamodb.OldImage.id.S;
		const user = Entities.User({ id });
		await user.discontinueCognito(); // disable user in cognito
	}

};

export const handler = withLambdaStandard(main);