# **TECHNICAL README!**
## **READ ME BEFORE PROGRESSING**:
Most of the code in here is very experimental. Some of the stuff in here may be outdated and may not reflect what's in the actual code. The way I do things is probably not the best, I try to fix any flaws in my design as soon as I notice them. I haven't finished reading the **GoF** book so I don't know all the Design Patterns out there that might help me write better Object Oriented code. I'll work with what I already know at the moment and improve.

By the way, I'm really sorry if you don't get my explainations, they confuse even me some times. English is also not my first language so please don't mind any grammar mistakes & typos in here.

### **Some Terms Before Progressing**:
* **Upsert**: Update or Insert operation.
* **Client**: Higher level backend code(lambda function, testing utility) that uses some class unless explicitly specified to be the client front end, **client** does not refer to the front-end.
* **Entities**: Users, Alarms, etc
* **ATW**: At Time Of Writing

Alright, Let's get into it !!!

## **ABOUT**
I wanted to build something fun using **The Serverless Framework** and **DynamoDB**. When I took up this project, I was working on a simple React/Typescript clock web application and then had the bad idea to add a serverless backend to it, this has delayed the completion of the react app a great deal and I somehow regret the decision. I had and still have no concrete idea of what the final front & back-end application is gonna look like. This is also I learning project, I got some really good books on **DynamoDB** and **Object Oriented Software Design Patterns** and try to incorporate what I learn into this project and that's why spend most of my time refactoring. Oh and these books are:
* **[Dive Into DESIGN PATTERNS](https://refactoring.guru/design-patterns/book)**
* **[Design Patterns: Elements of Reusable Object-Oriented Software 1st Edition, Kindle Edition](https://www.amazon.com/Design-Patterns-Object-Oriented-Addison-Wesley-Professional-ebook/dp/B000SEIBB8)**
* **[The DynamoDB Book](https://www.dynamodbbook.com/)**

## **DynamoDB Single Table Design.**
At the moment, this project is too early to show true Single Table Design. I'm still figuring things out and writing down my access patterns.

I'm fairly new to the pattern and DynamoDB itself. I started this project thinking Single Table Design is dogma in DynamoDB. I didn't really understand the **What, Why and When's** of it.

Anyway, here are some resources on the topic:

* [Alex Debrie: The What, Why, and When of Single-Table Design with DynamoDB](https://www.alexdebrie.com/posts/dynamodb-single-table/) : In this article, He explains why a Single Table Design is somewhat pointless when working with GraphQL. I'm yet to find any drowbacks to using a Single Table for this use case tho.
* [Fundamentals of Amazon DynamoDB Single Table Design with Rick Houlihan](https://youtu.be/KYy8X8t4MB8) - ATW, I'm only halfway watching this.


## **Singletons**

You'll see something like this everywhere in the code:(Entity Factories, Testing
Utilities, etc)

```typescript
class SingletonClass {
  private constructor() {}
  static readonly instance = new Singleton();
}

export const Singleton = SingletonClass.instance;
```

This is just special syntax for coming up with a singleton. The class has a
**private constructor** so it can not be instaciated outside of it's definition.
The **static readonly instance** holds the one instance that should exist of
that class. I'm not fully sure why doing `new Singleton()` works inside the
class but Typescript is weird, The same syntax does not work in good ol plain
javascript though. If this syntax is flawed then the way to go would be
something like this:

```typescript
class Singleton {

  private constructor() {}

  static readonly Instance: Singleton;

  static instance() {
    if (!this.Instance) this.Instance = new Singleton();
    return this.Instance;
  }

}

export const SingletonInstance = Singleton.instance();
```
We do not have static classes in **Javascript** like we do in **C#** :(.

And yes, this could very well be a frozen **Object**. So you might just hard code the singleton . I do not for the simple reason that I dislike the syntax. A hardcoded object with just a few properties and methods is fine. But as it
grows with more methods and properties, looking at a huge hardcoded object is
somewhat hard for me. They are some that are hardcoded frozen objects though and they'll probably not exist for long.

For Singletons with one method, they might as well just be
a function, I have no problem with that but they may come a time that new
methods should be introduced to the Singleton. And turning it into a Singleton
then will be too much work, especially updating it's clients.

*****

## **Entity Groups**

An **EntityGroup** is a collection(namespace) of variants for an entity type.

### \* **Null Entities**.

These are intermidiary variants you'll find in almost all entity groups. They are used to obtain non-null variants of an entity type.
Their **sync** methods query the database for an absolute entity and if one is found, they configure and return an absolute variant of the same entity type.

### * **List Of All Entity Groups And Their Variants:** (still growing)

1. **UserEntityGroup**: NullUser and User.
2. **AlarmEntityGroup**: NullAlarm and Alarm.

***

## **`"attribute" in this`** when setting optional attributes.
The setAttributes function of the _abstract_ **Entity** is used to upsert an entities attributes.
To do so, it loops through all the entries of the attributes provided to it and upserts the attributes that should exist in the class, into class (get it?).

For optional entity attributes that are not assigned at instanciation, you have to assign them null at instanciation. Something like:

```typescript
class ExampleEntity {
  // and yes, first letter in attributes should be capitalized, that's a rule!
  OptionalAttribute1: string | null = null;
  OptionalAttributes2: number | null = null;
}
```

This is absolutely necesary, if you do not assign some value(null preffered) to the optional attribute at creation, **"attribute" in this** will return false and result into that attribute not being upserted.

This null assignment to optional attributes is done by the class and not the client. So unless you're writing some entity variant classes, you need not worry about this.


## **`static new()`** and **`private _constructor()`** methods
These utility methods are used to instanciate variants of a particular entity group whose constructor signature can't seem to match the abstract **`Entity`** class.

For this to work, the constructor in the class is marked **`protected`**.

The **`static new()`** method is available to the client, which in most cases is the **`EntityFactory`**. The method creates a new instance of the variant and calls the **`_constructor()`** method.

The **`protected _constructor()`** method acts like the constructor and does whatever was meant to be done in the constructor.