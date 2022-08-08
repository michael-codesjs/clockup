import { PostConfirmationTriggerEvent } from "aws-lambda";
import { User } from "../../../framework/entities";
import { dynamoDbOperations } from "../../../model";
import { configureEnviromentVariables } from "../../../utilities/functions";


configureEnviromentVariables();

export const handler = async function(event:PostConfirmationTriggerEvent) {

  if(event.triggerSource === "PostConfirmation_ConfirmSignUp") {

    const user = new User({
      id: event.userName,
      email: event.request.userAttributes.email,
      name: event.request.userAttributes.name,
    });
    
    await dynamoDbOperations.put({
      TableName: process.env.DYNAMO_DB_TABLE_NAME!,
      Item: user.toDynamoDbPutItem(),
      ConditionExpression: "attribute_not_exists(PK)"
    });

    return event; 
  
  } else {
    
    throw new Error("Invalid triggerSource for specified handler: confirmUserSignUp");
  
  }

}