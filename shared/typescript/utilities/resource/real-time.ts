

class RealTimeResources {

  private constructor() {}
  static readonly instance = new RealTimeResources;

  /*
  readonly tableName = "${ssm:/clock-up/${self:custom.stage}/real-time/storage/table/name}" as const;
	readonly tableArn = "${ssm:/clock-up/${self:custom.stage}/real-time/storage/table/arn}" as const;
	readonly tableStreamArn = "${ssm:/clock-up/${self:custom.stage}/real-time/storage/table/stream/arn}" as const;
  */

  readonly topicArn = "${ssm:/clock-up/${self:custom.stage}/real-time/topic/arn}" as const;
	readonly requestQueueArn = "${ssm:/clock-up/${self:custom.stage}/real-time/queues/request/arn}" as const;
	readonly requestQueueURL = "${ssm:/clock-up/${self:custom.stage}/real-time/queues/request/url}" as const;
  readonly responseQueueArn = "${ssm:/clock-up/${self:custom.stage}/real-time/queues/response/arn}" as const;
	readonly responseQueueURL = "${ssm:/clock-up/${self:custom.stage}/real-time/queues/response/url}" as const;

}

export const realTimeResources = RealTimeResources.instance;