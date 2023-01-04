import { userServiceIO } from "./user";

class ServiceIOCollection {

  private constructor() {}
  static readonly instance = new ServiceIOCollection;

  readonly user: typeof userServiceIO = userServiceIO;

}

export const ServiceIO = ServiceIOCollection.instance;