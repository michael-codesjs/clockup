
class ApiResources {

  private constructor() {}
  static readonly instance = new ApiResources;

  readonly graphQlApiId = "${ssm:/clock-up/${self:custom.stage}/api/graphql/id}" as const;
	readonly graphQlApiEndpoint = "${ssm:/clock-up/${self:custom.stage}/api/graphql/endpoint}" as const;

}

export const apiResources = ApiResources.instance;