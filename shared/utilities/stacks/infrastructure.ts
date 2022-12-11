
export const infrastructure = Object.freeze({
	name: "infrastructure",
	outputs: {
		table: {
			stack: "infrastructure",
			name: "dynamoDbTableName",
			arn: "dynamoDbTableArn",
		},
		tableStream: {
			arn: "dynamoDbTableStreamArn"
		},
		assetsBucket: {
			stack: "infrastructure",
			name: "assetsBucketName",
			arn: "assetsBucketArn",
		}
	}
});