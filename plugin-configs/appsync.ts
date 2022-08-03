import { generateServiceName } from "../utilities/functions";

export const appsyncConfig = {
  appSync: {
    name: generateServiceName("api"),
    schema: "./schema.api.graphql",
    region: "${self:custom.region}",
    authenticationType: "AMAZON_COGNITO_USER_POOLS",
    userPoolConfig: {
      userPoolId: { Ref: "CognitoUserPool" },
      defaultAction: "ALLOW",
    },
    additionalAuthenticationProviders: [
      { authenticationType: 'AWS_IAM' }
    ],
    mappingTemplatesLocation: "./mapping-templates",
    dataSources: [
      {
        type: "NONE",
        name: "none",
      }
    ]
  }
};