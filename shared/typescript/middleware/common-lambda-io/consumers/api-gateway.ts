import middy from "@middy/core";
import { APIGatewayProxyEvent, Context } from "aws-lambda";
import { ErrorResponse } from "../../../abstracts";
import { CommonIOEvent, CommonInputSources, Consumer } from "../types";

export class CommonIoApiGatewayConsumer implements Consumer {

  async request(request: middy.Request<APIGatewayProxyEvent, any, Error, Context>): Promise<void> {

    let event: CommonIOEvent<any> = {
      inputs: [request.event.body]
    }

    request.internal = {
      originalEvent: Object.assign({}, request.event)
    };

    request.event = event as unknown as APIGatewayProxyEvent; // replace APIGatewayProxyEvent event with CommonIOEvent

  }

  async error(request: middy.Request<CommonInputSources<any, any>, any, Error, Context>): Promise<void> {

    console.error(request.error); // log for debugging purposes.

    const errorResponse = new ErrorResponse(request.error);

    request.response = {
      statusCode: errorResponse.error.code,
      message: errorResponse.graphQlEntity()
    }

  }

  async response(request: middy.Request<APIGatewayProxyEvent, Array<Record<string, any>>, Error, Context>): Promise<void> {
    request.response = {
      statusCode: 200,
      body: JSON.stringify(request.response[0])
    } as unknown as Array<Record<string, any>>;
  }

}