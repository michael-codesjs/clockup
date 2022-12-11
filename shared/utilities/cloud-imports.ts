
class CloudImports {

	private constructor() { }
	static readonly instance = new CloudImports;

  readonly tableName = "${ssm:/clock-up/${self:custom.stage}/storage/table/name}" as const;
  readonly tableArn = "${ssm:/clock-up/${self:custom.stage}/storage/table/arn}" as const;
  readonly tableStreamArn = "${ssm:/clock-up/${self:custom.stage}/storage/table/stream/arn}" as const;

  readonly userPoolId = "${ssm:/clock-up/${self:custom.stage}/authentication/user-pool/id}" as const;
  readonly userPoolArn = "${ssm:/clock-up/${self:custom.stage}/authentication/user-pool/arn}" as const;

  readonly graphQlApiId = "${ssm:/clock-up/${self:custom.stage}/api/graphql/id}" as const;
  readonly graphQlApiEndpoint = "${ssm:/clock-up/${self:custom.stage}/api/graphql/endpoint}" as const;

  get common() {
    return {
      tableName: this.tableName,
      tableArn: this.tableArn,
      graphQlApiId: this.graphQlApiId,
      graphQlApiEndpoint: this.graphQlApiEndpoint

    }
  }

}

export const cloudImports = CloudImports.instance;