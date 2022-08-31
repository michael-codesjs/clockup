
import { PutItemInputAttributeMap } from "aws-sdk/clients/dynamodb";
import { Entity, User } from "."
import { EntityType, Alarm as TypeAlarm } from "../../types/api";
import { PutItem } from "../../types/utility";

export class Alarm extends Entity {
  
  entityType: EntityType.ALARM;
  PK: string;
  SK: string;

  id: string;
  created: Date;

  name: string;
  enabled: boolean;
  modified: Date;
  days: Array<number>;
  time: { hour: number, minute: number };
  snooze: { repeat: number, interval: number }
  onceOff: boolean;

  
  constructor(properties: { creator: User, id?: string, created?: string }) {
    
    let { id, created } = properties;

    super({ entityType: EntityType.USER, id, created });
    
  }

  get mutableArguments(): { [k: string]: any; } {
    return {
      name: this.name,
      enabled: this.enabled,
      modified: new Date().toJSON(),
      days: this.days,
      time: this.time,
      snooze: this.snooze,
      onceOff: this.onceOff
    }
  }

  toDynamoDbPutItem(): PutItemInputAttributeMap {

    const item:PutItem<TypeAlarm> = {
      PK: this.PK,
      SK: this.SK,
      id: this.id,
      created: new Date().toJSON(),
      name: this.name,
      enabled: this.enabled,
      modified: new Date().toJSON(),
      days: this.days,
      time: this.time,
      snooze: this.snooze,
      onceOff: this.onceOff
    };

    return item as PutItemInput["Item"];

  }

}