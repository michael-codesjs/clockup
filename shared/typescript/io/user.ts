import { SNS, SQS } from "aws-sdk";
import { configureEnviromentVariables } from "../utilities/functions";
import { apiGatewaySignedFetch } from './api-gateway-signed-fetch';
import { CREATE, CREATED, Inputs } from "./types/user";

const { USER_API_URL, REGION } = configureEnviromentVariables();

/** Utility class for sending inputs to the user service. */
class UserServiceIO {

  private constructor() { }
  static readonly instance = new UserServiceIO();

  get snsServiceObject() {
    return new SNS({ apiVersion: "2010-03-32", region: REGION });
  }

  get sqsServiceObject() {
    return new SQS({ apiVersion: "2012-11-05" });
  }

  /** Sends a "CREATE" input to the user service via it's API. Is a synchronous operation so expect a "CREATED" response. */
  async create(params: Pick<CREATE, "cid" | "payload">): Promise<CREATED> {

    const body = JSON.stringify({ type: Inputs.CREATE, ...params });

    const response = await apiGatewaySignedFetch(USER_API_URL, {
      method: 'post',
      body: body,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    return await response.json();

  }

}

export const userServiceIO = UserServiceIO.instance;