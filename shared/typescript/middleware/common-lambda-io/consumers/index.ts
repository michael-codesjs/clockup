import { AppSyncResolverEvent, SNSEvent, SQSEvent, APIGatewayProxyEvent } from "aws-lambda";
import { CommonIOInputSources, Consumer, StateMachineEvent } from "../types";
import { CommonIoSQSConsumer } from "./sqs";
import { CommonIoStateMachineConsumer } from "./state-machine";
import { CommonIoApiGatewayConsumer } from "./api-gateway";

class ConsumerFactory {

  private constructor() { }
  static readonly instance = new ConsumerFactory();

  private hasRecords(event: CommonIOInputSources<any, any>): event is SNSEvent | SQSEvent {
    return "Records" in event && Boolean(event.Records);
  }

  private isApiGatewayEvent(event: CommonIOInputSources<any, any>): event is APIGatewayProxyEvent {
    return ["body", "headers", "httpMethod", "path"].every(key => key in event);
  }

  private isSQSEvent(event: CommonIOInputSources<any, any>): event is SQSEvent {
    return this.hasRecords(event) && "eventSource" in event.Records[0] && event.Records[0].eventSource === "aws:sqs";
  }

  private isSNSEvent(event: CommonIOInputSources<any, any>): event is SNSEvent {
    return this.hasRecords(event) && "Sns" in event;
  }

  private isAppSyncEvent(event: CommonIOInputSources<any, any>): event is AppSyncResolverEvent<any, any> {
    return ["arguments", "prev", "stash", "identity", "source"].every(key => key in event);
  }

  private isStateMachineEvent(event: CommonIOInputSources<any, any>): event is StateMachineEvent {
    return "source" in event && event.source === "StateMachine";
  }

  consumer(event: CommonIOInputSources<any, any>): Consumer {
    if(this.isSQSEvent(event)) return new CommonIoSQSConsumer();
    // else if(this.isSNSEvent(event)) return;
    // else if(this.isAppSyncEvent(event)) return;
    else if (this.isApiGatewayEvent(event)) return new CommonIoApiGatewayConsumer();
    else if (this.isStateMachineEvent(event)) return new CommonIoStateMachineConsumer();
    else throw new Error("Unrecognized event. Can not generate consumer.");
  }

}

export const Consumers = ConsumerFactory.instance;