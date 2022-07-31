import { dynamoDbOperations } from "../../model"
import { configureEnviromentVariables } from "../../utilities/functions";
import { User } from "../types/types";

configureEnviromentVariables();

export abstract class Then {

  static async userExistsInTable(username) {

    const result = await dynamoDbOperations.get({
      TableName: process.env.DYNAMO_DB_TABLE_NAME!,
      Key: {
        id: username as any
      }
    });

    return result;

  }

}