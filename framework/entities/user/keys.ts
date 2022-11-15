import { Entity, Keys } from "../abstracts";
import { IUser } from "../abstracts/interfaces";

export class UserKeys extends Keys {

  public Entity: Entity & IUser

  /** Sets user entity's desired GSIS keys */
  configure(): void {
    
  }

}