import { generateLogicalResourcelName } from "../../../utilities/functions";

export const cognitoUserPoolResource = {
  Type: "AWS::Cognito::UserPool",
  Properties: {
    UserPoolName: "${self:custom.userPoolName}",
    UsernameAttributes: ["email"],
    Policies: {
      PasswordPolicy: {
        MinimumLength: 7,
        RequireLowercase: false,
        RequireUppercase: false,
        RequireSymbols: false,
        RequireNumbers: false,
      }
    },
    Schema: [
      {
        Name: "name",
        AttributeDataType: "String",
        Required: false,
        Mutable: true
      }
    ]
  }
}