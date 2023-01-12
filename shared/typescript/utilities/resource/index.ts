import { apiResources } from "./api";
import { authenticationResources } from "./authentication";
import { testResources } from "./test";
import { userResources } from "./user";


class ResourceCollection {

  private constructor() {}
  static readonly instance = new ResourceCollection;

  readonly test: typeof testResources = testResources;
  readonly authentication: typeof authenticationResources = authenticationResources;
  readonly api: typeof apiResources = apiResources;
  readonly user: typeof userResources = userResources;

}

export const resource = ResourceCollection.instance;