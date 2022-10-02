# **TECHNICAL README!**
## **READ ME BEFORE PROGRESSING**:
Most of the code in here is very experimental. Some of the stuff in here may be outdated and may not reflect what's in the actual code. The way I do things is probably not the best, I try to fix any flaws in my design as soon as I notice them. I haven't finished reading the **GoF** book so I don't know all the Design Patterns out there that might help me write better Object Oriented code. I'll work with what I already know at the moment and improve.

By the way, I'm really sorry if you don't get my explainations, they confuse even me some times. English is also not my first language so please don't mind any grammar mistakes & typos in here.

### **Some Terms Before Progressing**:
* **Upsert**: Update or Insert operation.
* **Client**: Higher level backend code(lambda function, testing utility) that uses some class. Client does not refer to the client front-end.

Alright, Let's get into it !!!

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