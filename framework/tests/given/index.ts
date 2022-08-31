import { Attributes } from "./attributes";
import { Entities } from "./entities";
import { Handler } from "./handler";

export abstract class Given {
  static readonly handler = Handler; 
  static readonly attributes = Attributes
  static readonly entities = Entities
}