import { Handler, PostConfirmationTriggerEvent } from "aws-lambda";
import { withLambdaStandard } from "../../../shared/hofs/with-lambda-standard";


const main: Handler<PostConfirmationTriggerEvent, PostConfirmationTriggerEvent> = async event => {

  if (event.triggerSource === "PostConfirmation_ConfirmSignUp") {

    const { email, name } = event.request.userAttributes;
    const id = event.userName;

    // await Entities
    // .User({ id, email, name, alarms: 0 }) // instanciate a new UserEntityGroup.User
    // .put(); // insert user record into the table

    return event;

  } else {

    throw new Error("Invalid triggerSource for specified handler: confirmUserSignUp");

  }

};

export const handler = withLambdaStandard(main);