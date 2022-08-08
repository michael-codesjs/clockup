import { logicalResourceNames } from "../utilities/constants";
import { generateLogicalResourcelName } from "../utilities/functions";

export const cognitoUserPoolResource = {
  [logicalResourceNames.userPool]: {
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
}