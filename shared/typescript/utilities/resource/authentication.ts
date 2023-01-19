
class AutheenticationResources {

  private constructor() {}
  static readonly instance = new AutheenticationResources;

  readonly userPoolName = "${ssm:/clock-up/${self:custom.stage}/authentication/user-pool/name}" as const;
	readonly userPoolId = "${ssm:/clock-up/${self:custom.stage}/authentication/user-pool/id}" as const;
	readonly userPoolArn = "${ssm:/clock-up/${self:custom.stage}/authentication/user-pool/arn}" as const;
	readonly userPoolWebClient = "${ssm:/clock-up/${self:custom.stage}/authentication/user-pool/client/web/id}";

  readonly requestQueueArn = "${ssm:/clock-up/${self:custom.stage}/authentication/queues/request/arn}";
  readonly requestQueueURL = "${ssm:/clock-up/${self:custom.stage}/authentication/queues/request/url}"; 
  readonly responseQueueArn = "${ssm:/clock-up/${self:custom.stage}/authentication/queues/response/arn}";
  readonly responseQueueURL = "${ssm:/clock-up/${self:custom.stage}/authentication/queues/response/url}";

}

export const authenticationResources = AutheenticationResources.instance;