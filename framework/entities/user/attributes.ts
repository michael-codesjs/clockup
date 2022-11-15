import { EntityType, User } from "@local-types/api";
import { Attributes } from "../abstracts";

export class UserAttributes extends Attributes<User> {

  private static readonly config = {
    name: { initial: null, required: true },
    email: { initial: null, required: true },
    alarms: { initial: null, required: false }
  };

  constructor() {
    super(UserAttributes.config);
  }

  parse(attribtues: Partial<User>) {
    super.parse({
      ...attribtues,
      entityType: EntityType.User
    });
  }

  /** attributes also stored in cognito */
  get cognito() {
    return {
      name: this.get("name"),
      email: this.get("email")
    }
  }

}