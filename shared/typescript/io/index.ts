import { authenticationServiceIO } from "./authentication";
import { realTime } from "./real-time";
import { userServiceIO } from "./user";

class ServiceIOCollection {

  private constructor() {}
  static readonly instance = new ServiceIOCollection;

  readonly user: typeof userServiceIO = userServiceIO;
  readonly authentication: typeof authenticationServiceIO = authenticationServiceIO;
  readonly realTime: typeof realTime = realTime;

}

export const ServiceIO = ServiceIOCollection.instance;