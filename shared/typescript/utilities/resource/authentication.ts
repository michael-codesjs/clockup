
class AutheenticationResources {

  private constructor() {}
  static readonly instance = new AutheenticationResources;

  readonly subnetId = "${ssm:/clockup/${self:custom.stage}/authentication/network/subnet/id}" as const;
  readonly securityGroupId = "${ssm:/clockup/${self:custom.stage}/authentication/network/security-group/id}" as const;

  readonly userPoolName = "${ssm:/clockup/${self:custom.stage}/authentication/user-pool/name}" as const;
	readonly userPoolId = "${ssm:/clockup/${self:custom.stage}/authentication/user-pool/id}" as const;
	readonly userPoolArn = "${ssm:/clockup/${self:custom.stage}/authentication/user-pool/arn}" as const;
	readonly userPoolWebClient = "${ssm:/clockup/${self:custom.stage}/authentication/user-pool/client/web/id}";

  readonly requestQueueArn = "${ssm:/clockup/${self:custom.stage}/authentication/queues/request/arn}";
  readonly requestQueueURL = "${ssm:/clockup/${self:custom.stage}/authentication/queues/request/url}"; 
  readonly responseQueueArn = "${ssm:/clockup/${self:custom.stage}/authentication/queues/response/arn}";
  readonly responseQueueURL = "${ssm:/clockup/${self:custom.stage}/authentication/queues/response/url}";

}

export const authenticationResources = AutheenticationResources.instance;