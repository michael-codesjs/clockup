import { esBuildConfig } from "../plugin-configs/esbuild";
import { config, stackOutputNames } from "./constants";
import { importCloudFormationParam } from "./functions";

export const commonPlugins = [
  "serverless-esbuild",
  "serverless-export-env",
  "serverless-iam-roles-per-function",
];

export const commonPluginConfig = {
  ...esBuildConfig
}


export const commonCustom = {
  region: "${opt:region, self:provider.region}",
  stage: "${opt:stage, self:provider.stage}"
}

export const commonEnviromentVariables = {
  REGION: "${self:custom.region}",
  STAGE: "${self:custom.stage}",
  AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1"
};

export const commomEnviromentResources = {
  // use together with commonCloudFormationImports
  DYNAMO_DB_TABLE_NAME: "${self:custom.tableName}",
  GRAPHQL_API_ENDPOINT: "${self:custom.apiEndpoint}",
  COGNITO_USER_POOL_ID: "${self:custom.apiId}",
  COGNITO_CLIENT_ID: "${self:custom.apiEndpoint}"
}

export const commonCloudFormationImports = {
  tableName: importCloudFormationParam({
    name: config.serviceName,
    stack: "root",
    stage: "${self:custom.stage}",
    output: stackOutputNames.dynamoDbTableName
  }),
  tableArn:  importCloudFormationParam({
    name: config.serviceName,
    stack: "root",
    stage: "${self:custom.stage}",
    output: stackOutputNames.dynamoDbTableArn
  }),
  apiId: importCloudFormationParam({
    name: config.serviceName,
    stack: "api",
    stage: "${self:custom.stage}",
    output: stackOutputNames.GraphQlApiId
  }),
  apiEndpoint: importCloudFormationParam({
    name: config.serviceName,
    stack: "api",
    stage: "${self:custom.stage}",
    output: stackOutputNames.GraphQlApiUrl
  }),
}