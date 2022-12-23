import { Entity } from "..";
import { Semi } from "./semi";

/** State an entity is in when it knows itself and has enough attributes to PUT itself to the table.*/
export class Absolute extends Semi {

  update(): void {
    if(!this.context.attributes.isPutable()) {
      this.context.setState(Semi);
    }
  }

  async put(): Promise<Entity> {
    await this.model.put();
    return this.context;
  }

}