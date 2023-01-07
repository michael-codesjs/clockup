

class UserResources {

  private constructor() {}
  static readonly instance = new UserResources;

  readonly tableName = "${ssm:/clock-up/${self:custom.stage}/user/storage/table/name}" as const;
	readonly tableArn = "${ssm:/clock-up/${self:custom.stage}/user/storage/table/arn}" as const;
	readonly tableStreamArn = "${ssm:/clock-up/${self:custom.stage}/user/storage/table/stream/arn}" as const;

  readonly topicArn = "${ssm:/clock-up/${self:custom.stage}/user/topic/arn}" as const;
	readonly requestQueueArn = "${ssm:/clock-up/${self:custom.stage}/user/queues/request/arn}" as const;
	readonly requestQueueURL = "${ssm:/clock-up/${self:custom.stage}/user/queues/request/url}" as const;
  readonly responseQueueArn = "${ssm:/clock-up/${self:custom.stage}/user/queues/response/arn}" as const;
	readonly responseQueueURL = "${ssm:/clock-up/${self:custom.stage}/user/queues/response/url}" as const;

}

export const userResources = UserResources.instance;