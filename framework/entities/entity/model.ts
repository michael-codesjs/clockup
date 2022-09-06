import { GetItemOutput, PutItemOutput, UpdateItemOutput, DeleteItemOutput } from "aws-sdk/clients/dynamodb";
import dynamoDbExpression from "@tuplo/dynoexpr";
import { Entity } from ".";
import { dynamoDbOperations } from "../../../lib/dynamoDb";
import { configureEnviromentVariables } from "../../../utilities/functions";

const { DYNAMO_DB_TABLE_NAME } = configureEnviromentVariables();

export abstract class Model {

  readonly entity: Entity;

  constructor(entity: Entity) {
    this.entity = entity;
  }

  async get(): Promise<GetItemOutput> {
    
    return await dynamoDbOperations.get({
      TableName: DYNAMO_DB_TABLE_NAME!,
      Key: this.entity.keys,
    });

  }

  async put(): Promise<PutItemOutput> {

    return await dynamoDbOperations.put({
      TableName: DYNAMO_DB_TABLE_NAME!,
      Item: {
        ...this.entity.keys,
        ...this.entity.graphqlEntity!()
      }
    });

  }

  async mutate(): Promise<UpdateItemOutput> {

    const params = dynamoDbExpression({
      Update: this.entity.mutableAttributes()
    });

    return await dynamoDbOperations.update({
      TableName: DYNAMO_DB_TABLE_NAME!,
      Key: this.entity.keys,
      ...params as any,
      ReturnValues: "ALL_NEW"
    });

  }

  async delete(): Promise<DeleteItemOutput> {

    return await dynamoDbOperations.delete({
      TableName: DYNAMO_DB_TABLE_NAME!,
      Key: this.entity.keys
    })

  }

}


export abstract class NullModel {

  readonly entity: Entity;

  constructor(entity:Entity) {
    this.entity = entity;
  }
  
  async get(): Promise<GetItemOutput> {
    
    return await dynamoDbOperations.get({
      TableName: DYNAMO_DB_TABLE_NAME!,
      Key: this.entity.keys,
    });

  }

  async delete(): Promise<DeleteItemOutput> {

    return await dynamoDbOperations.delete({
      TableName: DYNAMO_DB_TABLE_NAME!,
      Key: this.entity.keys
    })

  }

}