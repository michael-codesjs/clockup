import { AppSyncResolverEvent, SNSEvent, SQSEvent } from "aws-lambda";
import { AllEventTypes, Consumer } from "../types";
import { CommonIoSQSConsumer } from "./sqs"

class ConsumerFactory {

  private constructor() { }
  static readonly instance = new ConsumerFactory();

  private hasRecords(event: AllEventTypes<any, any>): event is SNSEvent | SQSEvent {
    return "Records" in event && Boolean(event.Records);
  }

  private isSQSEvent(event: AllEventTypes<any, any>): event is SQSEvent {
    return this.hasRecords(event) && "eventSource" in event.Records[0] && event.Records[0].eventSource === "aws:sqs";
  }

  private isSNSEvent(event: AllEventTypes<any, any>): event is SNSEvent {
    return this.hasRecords(event) && "Sns" in event;
  }

  private isAppSyncEvent(event: AllEventTypes<any, any>): event is AppSyncResolverEvent<any, any> {
    return ["arguments", "prev", "stash", "identity", "source"].every(key => Boolean(event[key]));
  }

  consumer(event: AllEventTypes<any, any>): Consumer {
    if(this.isSQSEvent(event)) return new CommonIoSQSConsumer();
    // else if(this.isSNSEvent(event)) return;
    // else if(this.isAppSyncEvent(event)) return;
    else throw new Error("Unrecognized event");
  }

}

export const Consumers = ConsumerFactory.instance;