import { PostConfirmationTriggerEvent } from "aws-lambda";
import { dynamoDbOperations } from "../../../model";
import { configureEnviromentVariables } from "../../../utilities/functions";


configureEnviromentVariables();

export const handler = async function(event:PostConfirmationTriggerEvent) {

  console.log("triggered");
  console.log(event);

  if(event.triggerSource === "PostConfirmation_ConfirmSignUp") {

    const user = {
      entityType: "User" as any,
      id: event.userName as any,
      created: new Date().toJSON() as any,
      email: event.request.userAttributes.email as any,
      name: event.request.userAttributes.name as any,
      alarms: 0 as any
    }
    
    const result = await dynamoDbOperations.put({
      TableName: process.env.DYNAMO_DB_TABLE_NAME!,
      Item: user,
      ConditionExpression: "attribute_not_exists(id)"
    });

    return event; 
  
  } else {
    
    throw new Error("Invalid triggerSource for specified handler: confirmUserSignUp");
  
  }

}