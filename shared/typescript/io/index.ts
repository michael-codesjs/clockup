import { userServiceIO } from "./user";

class ServiceIO {

  private constructor() {}
  static readonly instance = new ServiceIO;

  readonly user: typeof userServiceIO = userServiceIO;

}

export const IO = ServiceIO.instance;