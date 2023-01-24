

class NetworkResources {

  private constructor() {}
  static readonly instance = new NetworkResources;

  readonly vpcId = "${ssm:/clockup/${self:custom.stage}/network/vpc/id}" as const;

}

export const networkResources = NetworkResources.instance;