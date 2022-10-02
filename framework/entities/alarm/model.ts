import { dynamoDbOperations } from "@lib/dynamoDb";
import { AbsoluteAlarm } from "@local-types/index";
import { configureEnviromentVariables } from "@utilities/functions";
import { ExecuteTransactionOutput } from "aws-sdk/clients/dynamodb";
import { Model } from "../abstracts";

const { DYNAMO_DB_TABLE_NAME } = configureEnviromentVariables();

export class AlarmModel extends Model {

  entity: AbsoluteAlarm;

  async put(): Promise<ExecuteTransactionOutput> {
    return await dynamoDbOperations.transactionWrite({
      TransactItems: [
        {
          // Put alarm record into table
          Put: {
            TableName: DYNAMO_DB_TABLE_NAME!,
            Item: this.entityDynamoDbPutItemInput(),
            ConditionExpression: "attribute_not_exists(PK)"
          }
        },
        {
          // Update user record to have +1 alarms
          Update: {
            TableName: DYNAMO_DB_TABLE_NAME!,
            Key: {
              ...this.entity.Creator.Keys.primary() as any
            },
            UpdateExpression: "ADD alarms :one",
            ExpressionAttributeValues: {
              ":one": 1 as any
            },
            ConditionExpression: "attribute_exists(PK)"
          }
        }
      ]
    })
  }

}