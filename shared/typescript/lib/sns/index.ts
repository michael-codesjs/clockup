import { userSnsTopic } from "./user";

class SNSTopics {

  private constructor() {}
  static readonly instance = new SNSTopics;

  readonly user: typeof userSnsTopic = userSnsTopic;

}

export const Topics = SNSTopics.instance;