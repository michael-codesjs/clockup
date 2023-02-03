
class AutheenticationResources {

  private constructor() {}
  static readonly instance = new AutheenticationResources;

  readonly userPoolName = "${ssm:/clockup/${self:custom.stage}/authentication/user-pool/name}" as const;
	readonly userPoolId = "${ssm:/clockup/${self:custom.stage}/authentication/user-pool/id}" as const;
	readonly userPoolArn = "${ssm:/clockup/${self:custom.stage}/authentication/user-pool/arn}" as const;
	readonly userPoolWebClient = "${ssm:/clockup/${self:custom.stage}/authentication/user-pool/client/web/id}";

  readonly apiId = "${ssm:/clockup/${self:custom.stage}/authentication/api/id}" as const;
  readonly apiArn = "${ssm:/clockup/${self:custom.stage}/authentication/api/arn}" as const;
  readonly apiRootResourceId = "${ssm:/clockup/${self:custom.stage}/authentication/api/root-resource-id}" as const;
  readonly apiUrl = "${ssm:/clockup/${self:custom.stage}/authentication/api/url}" as const;

  readonly requestQueueArn = "${ssm:/clockup/${self:custom.stage}/authentication/queues/request/arn}";
  readonly requestQueueURL = "${ssm:/clockup/${self:custom.stage}/authentication/queues/request/url}"; 
  readonly responseQueueArn = "${ssm:/clockup/${self:custom.stage}/authentication/queues/response/arn}";
  readonly responseQueueURL = "${ssm:/clockup/${self:custom.stage}/authentication/queues/response/url}";

}

export const authenticationResources = AutheenticationResources.instance;