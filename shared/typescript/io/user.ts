
import { SNS } from "aws-sdk";
import { Create, Inputs } from "./types/user";
import { configureEnviromentVariables, isLiteralArray, isLiteralObject } from "../utilities/functions";

const {
  USER_TOPIC_ARN,
  REGION
} = configureEnviromentVariables();

/** Utility class for sending messages to the user service. */
class UserServiceIO {

  private constructor() { }
  static readonly instance = new UserServiceIO();

  get snsServiceObject() {
    return new SNS({
      apiVersion: "2010-03-32",
      region: REGION
    });
  }

  async create(params: Create["payload"]) {

    const message: Create = {
      time: new Date(),
      type: Inputs.CREATE,
      payload: params
    };

    const serviceObject = this.snsServiceObject;

    return await serviceObject.publish({
      Message: JSON.stringify(message),
      MessageAttributes: {
        type: {
          DataType: "String",
          StringValue: Inputs.CREATE
        }
      },
      TopicArn: USER_TOPIC_ARN,
    }).promise();

  }

}

export const userServiceIO = UserServiceIO.instance;