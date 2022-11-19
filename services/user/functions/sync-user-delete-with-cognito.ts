import Entities from "@entities";
import { DynamoDBStreamHandler } from "aws-lambda";

export const handler: DynamoDBStreamHandler = async event => {

	for (const record of event.Records) {
		const id = record.dynamodb.OldImage.id.S;
		const user = Entities.User({ id });
		await user.terminateCognito(); // delete user from cognito
	}

};