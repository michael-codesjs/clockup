
export const root = Object.freeze({
	name: "root",
	outputs: {
		table: {
			stack: "root",
			name: "dynamoDbTableName",
			arn: "dynamoDbTableArn",
		},
		assetsBucket: {
			stack: "root",
			name: "assetsBucketName",
			arn: "assetsBucketArn",
		}
	}
});