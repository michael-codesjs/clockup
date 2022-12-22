## **Folder Structure**.
### **Config**

Contains config files for stuff like jest, jsdoc, eslint and many more.

### **Infrastructure**

Contains terraform source files where we define our infrastructure. Our infrastructure is split into 4 modules, these are the:
- **api** infrastructure, eg: AppSync GraphQL API.
- **authentication** infrastructure, eg: Cognito User Pool, Cognito Clients.
- **io** infrastructure for communication between our microservices, eg: SNS topics, SQS queues and EventBridge event buses.
- **storage** infrastructure, eg: single DynamoDB table and S3 buckets.


### **Scripts**

Contains scripts for perfoming jobs like:
- Deploying and Destroying the project, infrastructure and/or microservices.
- Generating enviroment variables to be used in tests.
- Generating typescript types and graphql queries & mutations from the schema.

### **Services**

Contains our projects serverless microservices which are their own NodeJS projects with their own dependencies.

### **Shared**

Contains all shared code between microservices. Shared code is grouped by programming language.


***


## **Entity Groups**

An **EntityGroup** is a collection(namespace) of variants of an entity type.

### \* Null Entities.

These are universal intermidiary variants you'll find in almost all entity groups. They are used to obtain non-null variants of an entity type.
Their **sync** methods query the database for an absolute entity and if one is found, they configure and return an absolute variant of the same entity type.

### * **List Of All Entity Groups And Their Variants:** (still growing)

1. **UserEntityGroup**: NullUser and User.
2. **AlarmEntityGroup**: NullAlarm and Alarm.

***

## **Continuity**
A discontinued entity is one that has been deleted. We do not actually remove the entity record from the database, instead we append/prepend the string "DISCONTINUED" to it's keys(except primary). This makes it inaccesible to the front-end via querys unless explictly specified.

***

## **Singletons**

You'll see something like this everywhere in the code:(Entity Factories, Testing
Utilities, etc)

```typescript
class SingletonClass {
  private constructor() {}
  static readonly instance = new SingletonClass();
}

export const Singleton = SingletonClass.instance;
```

This is just special syntax for coming up with a singleton. The class has a
**private constructor** so it can not be instaciated outside of it's definition.
The **static readonly instance** holds the one instance that should exist of
that class.

And yes, this could very well be a frozen **Object**. So you might just hard code the singleton . I do not for the simple reason that I dislike the syntax. A hardcoded object with just a few properties and methods is fine. But as it
grows with more methods and properties, looking at a huge hardcoded object is
somewhat hard for me. They are some that are hardcoded frozen objects though and they'll probably not exist for long.

For Singletons with one method, they might as well just be
a function, I have no problem with that but they may come a time that new
methods should be introduced to the Singleton. And turning it into a Singleton
then will be too much work, especially updating it's users.