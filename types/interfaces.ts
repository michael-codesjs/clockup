import { Entity } from "framework/entities/entity";

export interface IEntityFactory {
  createEntity<T = any>(args:T): Entity
}