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

*****

## **Entity Groups**

An **EntityGroup** is a collection(namespace) of variants of an entity type.

### \* **Null Entities**.

These are universal intermidiary variants you'll find in almost all entity groups. They are used to obtain non-null variants of an entity type.
Their **sync** methods query the database for an absolute entity and if one is found, they configure and return an absolute variant of the same entity type.

### * **List Of All Entity Groups And Their Variants:** (still growing)

1. **UserEntityGroup**: NullUser and User.
2. **AlarmEntityGroup**: NullAlarm and Alarm.
