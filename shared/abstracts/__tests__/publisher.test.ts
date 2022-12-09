import { ISubscriber } from "../interfaces";
import { Publisher } from "../publisher";


describe("Publisher", () => {

	let publisher: Publisher;

	class Subscriber implements ISubscriber {
		valueToBeChangedOnUpdate = "default value";
		update(): void {
			this.valueToBeChangedOnUpdate = "new value";
		}
	}

	beforeEach(() => {
		publisher = new Publisher();
	});

	test("Publisher.subscribe && Publisher.unsubscribe && Publisher.publish", () => {

		const subscribersCount = Math.round(Math.random() * 90) + 10;

		const subscribers = Array(subscribersCount).fill(null).map(() => {
			const subscriber = new Subscriber();
			return subscriber;
		});

		/** subscribe */

		subscribers.forEach(subscriber => publisher.subscribe(subscriber));
		expect(publisher.subscribers.length).toBe(subscribersCount);
		expect(publisher.subscribers).toMatchObject(subscribers);

		/** unsubscribe */

		const unsubscribedCount = Math.round(Math.random() * (subscribersCount / 2)) + 1; // number of subscribers we are going to unsubscribe
		const randomIndexes = []; // random index of subscribers we are going to remove

		for (let x = 0; x < unsubscribedCount; x++) {
			let randomIndex: number;
			do {
				randomIndex = Math.round(Math.random() * unsubscribedCount);
			} while (randomIndexes.includes(randomIndex));
			randomIndexes.push(randomIndex);
		}

		randomIndexes.forEach(index => {
			const subscriber = subscribers[index];
			publisher.unsubscribe(subscriber);
			subscribers.splice(index, 1);
		});

		expect(publisher.subscribers.length).toBe(subscribersCount - unsubscribedCount);
		expect(publisher.subscribers).toMatchObject(subscribers);

		/** publish */

		publisher.publish();
		publisher.subscribers.forEach(subscriber => {
			expect((subscriber as Subscriber).valueToBeChangedOnUpdate).toBe("new value");
		});

	});

});