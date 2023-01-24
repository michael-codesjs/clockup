
class ApiResources {

  private constructor() {}
  static readonly instance = new ApiResources;

  readonly graphQlApiId = "${ssm:/clockup/${self:custom.stage}/api/graphql/id}" as const;
	readonly graphQlApiEndpoint = "${ssm:/clockup/${self:custom.stage}/api/graphql/endpoint}" as const;

}

export const apiResources = ApiResources.instance;