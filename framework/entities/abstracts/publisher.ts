import { IPublisher, ISubscriber } from "./interfaces";

export class Publisher implements IPublisher {

  subscribers: ISubscriber[] = [];

  subscribe(subscriber: ISubscriber): void {
    this.subscribers.push(subscriber);
  }

  unsubscribe(subscriber: ISubscriber): void {
    this.subscribers = this.subscribers.filter(_subscriber => _subscriber !== subscriber);
  }

  publish() {
    this.subscribers.forEach(subscriber => {
      subscriber.update();
    });
  }
  
}