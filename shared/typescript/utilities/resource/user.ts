

class UserResources {

  private constructor() {}
  static readonly instance = new UserResources;

  readonly subnetId = "${ssm:/clockup/${self:custom.stage}/user/network/subnet/id}" as const;
  readonly securityGroupId = "${ssm:/clockup/${self:custom.stage}/user/network/security-group/id}" as const;

  readonly tableName = "${ssm:/clockup/${self:custom.stage}/user/storage/table/name}" as const;
	readonly tableArn = "${ssm:/clockup/${self:custom.stage}/user/storage/table/arn}" as const;
	readonly tableStreamArn = "${ssm:/clockup/${self:custom.stage}/user/storage/table/stream/arn}" as const;

  readonly apiId = "${ssm:/clockup/${self:custom.stage}/user/api/id}" as const;
  readonly apiArn = "${ssm:/clockup/${self:custom.stage}/user/api/arn}" as const;
  readonly apiRootResourceId = "${ssm:/clockup/${self:custom.stage}/user/api/root-resource-id}" as const;
  readonly apiUrl = "${ssm:/clockup/${self:custom.stage}/user/api/url}" as const;

  readonly topicArn = "${ssm:/clockup/${self:custom.stage}/user/topic/arn}" as const;
	readonly requestQueueArn = "${ssm:/clockup/${self:custom.stage}/user/queues/request/arn}" as const;
	readonly requestQueueURL = "${ssm:/clockup/${self:custom.stage}/user/queues/request/url}" as const;
  readonly responseQueueArn = "${ssm:/clockup/${self:custom.stage}/user/queues/response/arn}" as const;
	readonly responseQueueURL = "${ssm:/clockup/${self:custom.stage}/user/queues/response/url}" as const;

}

export const userResources = UserResources.instance;