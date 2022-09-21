import { Entity } from "framework/entities/abstracts";

export interface IEntityFactory {
  createEntity<T = any>(args:T): Entity
}
