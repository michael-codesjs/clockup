

class RealTimeResources {

  private constructor() {}
  static readonly instance = new RealTimeResources;

  /*
  readonly tableName = "${ssm:/clockup/${self:custom.stage}/real-time/storage/table/name}" as const;
	readonly tableArn = "${ssm:/clockup/${self:custom.stage}/real-time/storage/table/arn}" as const;
	readonly tableStreamArn = "${ssm:/clockup/${self:custom.stage}/real-time/storage/table/stream/arn}" as const;
  */

  readonly topicArn = "${ssm:/clockup/${self:custom.stage}/real-time/topic/arn}" as const;
	readonly requestQueueArn = "${ssm:/clockup/${self:custom.stage}/real-time/queues/request/arn}" as const;
	readonly requestQueueURL = "${ssm:/clockup/${self:custom.stage}/real-time/queues/request/url}" as const;
  readonly responseQueueArn = "${ssm:/clockup/${self:custom.stage}/real-time/queues/response/arn}" as const;
	readonly responseQueueURL = "${ssm:/clockup/${self:custom.stage}/real-time/queues/response/url}" as const;

}

export const realTimeResources = RealTimeResources.instance;