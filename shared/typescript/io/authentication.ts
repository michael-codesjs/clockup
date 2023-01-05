
import { SNS } from "aws-sdk";
import { configureEnviromentVariables } from "../utilities/functions";
import { Delete, Inputs } from "./types/authentication";

const {
  AUTHENTICATION_TOPIC_ARN,
  REGION
} = configureEnviromentVariables();

/** Utility class for sending messages to the user service. */
class AuthenticationServiceIO {

  private constructor() { }
  static readonly instance = new AuthenticationServiceIO();

  get snsServiceObject() {
    return new SNS({
      apiVersion: "2010-03-32",
      region: REGION
    });
  }

  async delete(params: Delete["payload"]) {

    const message: Delete = {
      time: new Date(),
      type: Inputs.DELETE,
      payload: params
    };

    const serviceObject = this.snsServiceObject;

    return await serviceObject.publish({
      Message: JSON.stringify(message),
      MessageAttributes: {
        type: {
          DataType: "String",
          StringValue: Inputs.DELETE
        }
      },
      TopicArn: AUTHENTICATION_TOPIC_ARN,
    }).promise();

  }

}

export const authenticationServiceIO = AuthenticationServiceIO.instance;