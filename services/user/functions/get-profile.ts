import { AppSyncIdentityCognito, AppSyncResolverHandler } from "aws-lambda";
import { dynamoDbOperations } from "../../../model/index";
import { User } from "../../../types/appsync";
import { configureEnviromentVariables } from "../../../utilities/functions";

configureEnviromentVariables();

export const handler: AppSyncResolverHandler<null, User> = async (event) => {

  const identity = event.identity as AppSyncIdentityCognito;

  const user = await dynamoDbOperations.get({
    TableName: process.env.DYNAMO_DB_TABLE_NAME!,
    Key: {
      id: identity.sub as any
    }
  });

  return user.Item as User;

}