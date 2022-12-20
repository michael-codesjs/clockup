
class CloudImports {

	private constructor() { }
	static readonly instance = new CloudImports;

	readonly tableName = "${ssm:/clock-up/${self:custom.stage}/storage/table/name}" as const;
	readonly tableArn = "${ssm:/clock-up/${self:custom.stage}/storage/table/arn}" as const;
	readonly tableStreamArn = "${ssm:/clock-up/${self:custom.stage}/storage/table/stream/arn}" as const;

	readonly userPoolName = "${ssm:/clock-up/${self:custom.stage}/authentication/user-pool/name}" as const;
	readonly userPoolId = "${ssm:/clock-up/${self:custom.stage}/authentication/user-pool/id}" as const;
	readonly userPoolArn = "${ssm:/clock-up/${self:custom.stage}/authentication/user-pool/arn}" as const;
	readonly userPoolWebClient = "${ssm:/clock-up/${self:custom.stage}/authentication/user-pool/client/web/id}";

	readonly graphQlApiId = "${ssm:/clock-up/${self:custom.stage}/api/graphql/id}" as const;
	readonly graphQlApiEndpoint = "${ssm:/clock-up/${self:custom.stage}/api/graphql/endpoint}" as const;

	readonly userTopicArn = "${ssm:/clock-up/${self:custom.stage}/user/topic/arn}" as const;

	get common() {
		return {
			tableName: this.tableName,
			tableArn: this.tableArn,
			graphQlApiId: this.graphQlApiId,
			graphQlApiEndpoint: this.graphQlApiEndpoint

		};
	}

	get topics() {
		return {
			USER_TOPIC_ARN: this.userTopicArn
		};
	}

}

export const cloudImports = CloudImports.instance;