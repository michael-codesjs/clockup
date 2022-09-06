import { PostConfirmationTriggerEvent } from "aws-lambda";
import Entities from "@entities";

export const handler = async function(event:PostConfirmationTriggerEvent) {

  if(event.triggerSource === "PostConfirmation_ConfirmSignUp") {

    const { email, name } = event.request.userAttributes;
    const id = event.userName;

    await (
      Entities
      .user({ id, email, name }) // instanciate a new product of type User
      .sync({ exists: false }) // insert user record into the table
    );

    return event; 
  
  } else {
    
    throw new Error("Invalid triggerSource for specified handler: confirmUserSignUp");
  
  }

}