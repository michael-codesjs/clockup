
export const root = Object.freeze({
	name: "root",
	outputs: {
		table: {
			stack: "root",
			name: "dynamoDbTableName",
			arn: "dynamoDbTableArn",
		},
		tableStream: {
			arn: "dynamoDbTableStreamArn"
		},
		assetsBucket: {
			stack: "root",
			name: "assetsBucketName",
			arn: "assetsBucketArn",
		}
	}
});