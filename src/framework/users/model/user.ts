import { Entity } from "src/framework/entity";



export class User extends Entity {

  readonly entityType: string;
  
  constructor() {
    super();
    this.entityType = "User";
  }


}