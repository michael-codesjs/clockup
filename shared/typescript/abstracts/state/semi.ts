import { Absolute, Null } from ".";
import { Entity } from "..";

/** State an entity is in when it knows itself and some attributes but not enough attributes to perform a PUT operation. */
export class Semi extends Null {

  update(): void {
    if(!this.context.attributes.isUpdateable()) {
      this.context.setState(Null);
    } else if(this.context.attributes.isPutable()) {
      this.context.setState(Absolute);
    }
  }

  async sync(): Promise<Entity> {
    const { Attributes } = await this.model.update();
    this.context.attributes.parse(Attributes);
    return this.context;
  }

}