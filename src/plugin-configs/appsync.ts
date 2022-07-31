import { config } from "../utilities/constants";

export const appsyncConfig = {
  appSync: {
    name: `${config.serviceName}-api`,
    schema: "../../schema.api.graphql",
    region: "${self:custom.region}",
    authenticationType: "AMAZON_COGNITO_USER_POOLS",
    userPoolConfig: {
      userPoolId: { Ref: "CognitoUserPool" },
      defaultAction: "ALLOW",
    },
    mappingTemplatesLocation: "./src/mapping-templates",
    mappingTemplates: [
      {
        type: "Query",
        field: "getUser",
        dataSource: "usersTable",
        request: "get-user.request.vtl",
        response: "get-user.response.vtl" 
      }
    ],
    dataSources: [
      {
        type: "AMAZON_DYNAMODB",
        name: "usersTable",
        config: {
          tableName: { Ref: "UsersTable" }
        }
      }
    ]
  }
};