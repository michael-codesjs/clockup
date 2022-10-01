import { Entity } from "framework/entities/abstracts";

export interface IEntityFactory {
  createEntity(args: any): Entity
}

export interface IAbsoluteEntity {
  update(attributes:Record<string,any>): Promise<Entity & IAbsoluteEntity>
  put(): Promise<Entity & IAbsoluteEntity>
}