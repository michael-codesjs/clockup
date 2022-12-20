
import { SNS } from "aws-sdk";
import { UserCreateMessage, UserMessages } from "../../types/topic-messages";
import { configureEnviromentVariables, isLiteralArray, isLiteralObject } from "../..//utilities/functions";

const {
  USER_TOPIC_ARN,
  REGION
} = configureEnviromentVariables();

type PublishParams = {
  message: any,
  type: UserCreateMessage
};

type CreateMessageParams = {
  id: string,
  name: string,
  email: string,
  created?: string
};

class UserSnsTopic {

  private constructor() { }
  static readonly instance = new UserSnsTopic();

  get serviceObject() {
    return new SNS({
      apiVersion: "2010-03-32",
      region: REGION
    });
  }

  private async publish(params: PublishParams) {

    const serviceObject = this.serviceObject;

    const { message } = params;

    return await serviceObject.publish({
      Message: isLiteralObject(message) || isLiteralArray(message) ? JSON.stringify(message) : message,
      MessageStructure: "json",
      TopicArn: USER_TOPIC_ARN,
    }).promise();

  }

  async create(params: CreateMessageParams) {

    const message: UserCreateMessage = {
      time: new Date(),
      payload: params
    };

    const serviceObject = this.serviceObject;

    return await serviceObject.publish({
      Message: isLiteralObject(message) || isLiteralArray(message) ? JSON.stringify(message) : message,
      MessageAttributes: {
        type: {
          DataType: "String",
          StringValue: UserMessages.CREATE
        }
      },
      TopicArn: USER_TOPIC_ARN,
    }).promise();

  }

}

export const userSnsTopic = UserSnsTopic.instance;