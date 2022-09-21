import { logicalResourceNames } from "../utilities/constants";


export const webCognitoClientResource = {
	[logicalResourceNames.userPoolWebClient]: {
		Type: "AWS::Cognito::UserPoolClient",
		Properties: {
			UserPoolId: { Ref: logicalResourceNames.userPool },
			ClientName: "web",
			ExplicitAuthFlows: [
				"ALLOW_USER_SRP_AUTH",
				"ALLOW_USER_PASSWORD_AUTH",
				"ALLOW_REFRESH_TOKEN_AUTH"
			]
		}
	}
};