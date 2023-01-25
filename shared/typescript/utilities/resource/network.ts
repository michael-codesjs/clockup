

class NetworkResources {

  private constructor() {}
  static readonly instance = new this;

  readonly vpcId = "${ssm:/clockup/${self:custom.stage}/network/vpc/id}" as const;
  readonly subnetId = "${ssm:/clockup/${self:custom.stage}/network/subnet/id}" as const;

}

export const networkResources = NetworkResources.instance;