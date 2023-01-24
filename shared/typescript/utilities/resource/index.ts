import { apiResources } from "./api";
import { authenticationResources } from "./authentication";
import { testResources } from "./test";
import { userResources } from "./user";
import { realTimeResources } from "./real-time";
import { networkResources } from "./network";

class ResourceCollection {

  private constructor() {}
  static readonly instance = new ResourceCollection;

  readonly network: typeof networkResources = networkResources;
  readonly test: typeof testResources = testResources;
  readonly authentication: typeof authenticationResources = authenticationResources;
  readonly api: typeof apiResources = apiResources;
  readonly user: typeof userResources = userResources;
  readonly realTime: typeof realTimeResources = realTimeResources;

}

export const resource = ResourceCollection.instance;