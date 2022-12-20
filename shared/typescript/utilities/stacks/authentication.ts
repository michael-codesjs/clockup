
export const authentication = Object.freeze({
	name: "authentication",
	outputs: {
		cognito: {
			id: "cognitoUserPoolId",
			arn: "cognitoUserPoolArn",
		},

		clients: {
			web: {
				id: "cognitoClientId"
			}
		},
	}
});