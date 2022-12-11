import { esBuildConfig } from "../plugin-configs/esbuild";
import { AWS } from "../types/aws";
import { cloudImports } from ".";
import { config } from "./constants";

class Common {

	private constructor() { }
	static readonly instance = new Common;

	get providerSettings(): AWS.Service["provider"] {
		return {
			name: config.provider,
			region: config.region,
			stage: config.stage,
			runtime: config.runtime
		};
	}

	get plugins() {
		return [
			"serverless-esbuild",
			"serverless-export-env",
			"serverless-iam-roles-per-function",
		] as const;
	}

	get pluginConfigs() {
		return {
			...esBuildConfig
		} as const;
	}

	get custom() {
		return {
			region: "${opt:region, self:provider.region}",
			stage: "${opt:stage, self:provider.stage}"
		} as const;
	}

	get enviromentVariables() {
		return {
			REGION: "${self:custom.region}",
			STAGE: "${self:custom.stage}",
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1"
		} as const;
	}

	get enviromentResources() {
		return {
			DYNAMO_DB_TABLE_NAME: cloudImports.tableName,
			GRAPHQL_API_ID: cloudImports.graphQlApiId,
			GRAPHQL_API_ENDPOINT: cloudImports.graphQlApiEndpoint,
		} as const;
	}

}

export const common = Common.instance;