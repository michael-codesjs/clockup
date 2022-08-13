import { logicalResourceNames } from "../utilities/constants";

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
      ],
      LambdaConfig: {
        PostConfirmation: {
          "Fn::GetAtt": [logicalResourceNames.ConfirmSignUpLambdaFunction, "Arn"]
        },
        PreSignUp: {
          "Fn::GetAtt": [logicalResourceNames.PreSignUpLambdaFunction, "Arn" ]
        }
      }
    }
  },
  [logicalResourceNames.InvokeConfirmUserSignUpPermission]: {
    Type: 'AWS::Lambda::Permission',
    Properties: {
      Action: 'lambda:invokeFunction',
      FunctionName: {
        Ref: logicalResourceNames.ConfirmSignUpLambdaFunction,
      },
      Principal: 'cognito-idp.amazonaws.com',
      SourceArn: {
        'Fn::GetAtt': [logicalResourceNames.userPool, 'Arn'],
      },
    },
  },
  [logicalResourceNames.InvokePreSignUpPermission]: {
      Type: 'AWS::Lambda::Permission',
      Properties: {
        Action: 'lambda:invokeFunction',
        FunctionName: {
          Ref: logicalResourceNames.PreSignUpLambdaFunction,
        },
        Principal: 'cognito-idp.amazonaws.com',
        SourceArn: {
          'Fn::GetAtt': [logicalResourceNames.userPool, 'Arn'],
        },
      },
    },
}