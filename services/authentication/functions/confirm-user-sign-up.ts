import { PostConfirmationTriggerEvent } from "aws-lambda";
import { User } from "../../../framework/entities";

export const handler = async function(event:PostConfirmationTriggerEvent) {

  if(event.triggerSource === "PostConfirmation_ConfirmSignUp") {

    await User.new({
      id: event.userName,
      email: event.request.userAttributes.email,
      name: event.request.userAttributes.name,
    }).sync();

    return event; 
  
  } else {
    
    throw new Error("Invalid triggerSource for specified handler: confirmUserSignUp");
  
  }

}