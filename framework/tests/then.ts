import { dynamoDbOperations } from "../../lib/dynamoDb";
import { EntityType } from "../../types/api";
import { configureEnviromentVariables, constructKey } from "../../utilities/functions";

configureEnviromentVariables();

export abstract class Then {

  static async userExistsInTable(id) {

    const key = constructKey(EntityType.USER, id) as any;

    const result = await dynamoDbOperations.get({
      TableName: process.env.DYNAMO_DB_TABLE_NAME!,
      Key: {
        PK: key, SK: key
      }
    });

    return result;

  }

}