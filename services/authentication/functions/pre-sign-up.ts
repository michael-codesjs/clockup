import { PreSignUpTriggerEvent } from "aws-lambda";



export const handler = async(event:PreSignUpTriggerEvent) => {

  console.log("pre sign up");
  console.log(event);

  event.response.autoConfirmUser = true;
  event.response.autoVerifyEmail = true;

  return event;

}