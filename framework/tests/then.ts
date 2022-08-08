import { dynamoDbOperations } from "../../model";
import { EntityType } from "../../types/api";
import { configureEnviromentVariables, constructKey } from "../../utilities/functions";

configureEnviromentVariables();

export abstract class Then {

  static async userExistsInTable(username) {

    const key = constructKey(EntityType.USER, username) as any;

    const result = await dynamoDbOperations.get({
      TableName: process.env.DYNAMO_DB_TABLE_NAME!,
      Key: {
        PK: key, SK: key
      }
    });

    return result;

  }

}