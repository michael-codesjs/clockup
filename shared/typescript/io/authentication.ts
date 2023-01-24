
import { SNS, SQS } from "aws-sdk";
import { configureEnviromentVariables } from "../utilities/functions";
import { Delete, Inputs } from "./types/authentication";

const {
  AUTHENTICATION_REQUEST_QUEUE_URL,
  USER_RESPONSE_QUEUE_URL,
  REGION
} = configureEnviromentVariables();

/** Utility class for sending messages to the user service. */
class AuthenticationServiceIO {

  private constructor() { }
  static readonly instance = new AuthenticationServiceIO();

  private get snsServiceObject() {
    return new SNS({
      apiVersion: "2010-03-32",
      region: REGION
    });
  }

  private get sqsServiceObject() {
    return new SQS({ apiVersion: '2012-11-05' });
  }

  async delete(message: Delete) {

    const serviceObject = this.sqsServiceObject;
    
    return await serviceObject.sendMessage({
      MessageBody: JSON.stringify(message),
      MessageAttributes: {
        Type: {
          DataType: "String",
          StringValue: Inputs.DELETE
        },
        CID: {
          DataType: "String",
          StringValue: message.id
        },
        ReplyTo: {
          DataType: "String",
          StringValue: USER_RESPONSE_QUEUE_URL
        }
      },
      QueueUrl: AUTHENTICATION_REQUEST_QUEUE_URL,
    }).promise();

  }

}

export const authenticationServiceIO = AuthenticationServiceIO.instance;