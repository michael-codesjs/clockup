import { Attribute } from "../abstracts/attribute";
import { Attributes } from "../abstracts/attributes";
import { AbsoluteUserAttributes, AttributesParams } from "../types";

export class UserAttributes extends Attributes {

  private Name: Attribute<string, "name">;
  private Email: Attribute<string, "email">;

  constructor({ name, email, ...base }: AttributesParams & AbsoluteUserAttributes) {
    super(base);
    this.Name = new Attribute({ required: true, name: "name", value: name });
    this.Email = new Attribute({ required: true, name: "email", value: name });
  }

  putable(): boolean {
    return super.putable() && this.Email.putable() && this.Name.putable();
  }

}