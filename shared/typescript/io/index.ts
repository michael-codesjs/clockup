import { authenticationServiceIO } from "./authentication";
import { userServiceIO } from "./user";

class ServiceIOCollection {

  private constructor() {}
  static readonly instance = new ServiceIOCollection;

  readonly user: typeof userServiceIO = userServiceIO;
  readonly authentication: typeof authenticationServiceIO = authenticationServiceIO;

}

export const ServiceIO = ServiceIOCollection.instance;