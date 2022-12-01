import { dynamoDbOperations } from "@lib/dynamoDb";
import dynamoDbExpression from "@tuplo/dynoexpr";
import { configureEnviromentVariables } from "@utilities/functions";
import { ExecuteTransactionOutput } from "aws-sdk/clients/dynamodb";
import { Entity, Model } from "../abstracts";
import { IAlarm } from "../abstracts/interfaces";


const { DYNAMO_DB_TABLE_NAME } = configureEnviromentVariables();

export class AlarmModel extends Model {

  entity: Entity & IAlarm;

  putParams(): any {

    return dynamoDbExpression({
      TransactItems: [
        {
          Put: {
            TableName: DYNAMO_DB_TABLE_NAME,
            Key: this.entity.keys.primary(),
            Item: this.putAttributes(),
            Condition: {
              PK: "attribute_not_exists",
              SK: "attribute_not_exists"
            },
            ConditionLogicalOperator: "AND"
          },
        },
        {
          // update user record to have +1 alarms
          Update: {
            TableName: DYNAMO_DB_TABLE_NAME!,
            Key: this.entity.creator.keys.primary(),
            Update: {
              alarms: "alarms + 1"
            },
            Condition: {
              PK: "attribute_exists",
              SK: "attribute_exists",
              discontinued: false
            },
            ConditionLogicalOperator: "AND"
          }
        }
      ]
    });

  }

  protected discontinueParams() {
    return dynamoDbExpression({
      TransactItems: [
        {
          Update: {
            TableName: DYNAMO_DB_TABLE_NAME,
            Key: this.entity.keys.primary(),
            Update: this.discontinueAttributes(),
            Condition: {
              PK: "attribute_exists",
              SK: "attribute_exists",
              discontinued: false
            }
          }
        },
        // update user record to have -1 alarms
        {
          Update: {
            TableName: DYNAMO_DB_TABLE_NAME!,
            Key: this.entity.creator.keys.primary(),
            Update: {
              alarms: "alarms - 1"
            },
            Condition: {
              PK: "attribute_exists",
              SK: "attribute_exists",
              discontinued: false
            }
          }
        }
      ]
    });
  }

  async put(): Promise<ExecuteTransactionOutput> {
    return await dynamoDbOperations.transactionWrite(this.putParams());
  }

  async discontinue(): Promise<ExecuteTransactionOutput> {
    return await dynamoDbOperations.transactionWrite(this.discontinueParams() as any);
  }

}
