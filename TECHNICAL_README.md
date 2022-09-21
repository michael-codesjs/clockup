# Thought I should explain some re-occuring syntax in here
You'll see a lot of classes defined like this:

class ExampleClass {
  
  private constructor() {}
  static readonly instance = new Example();
  
  someMethod() {
    // do something
  }

}

export const ExampleInstance = ExampleClass.instance;

This is just how i make singletons since we do not have static classes in typescript.
A good ol frozen object would do the trick. But I dislike the syntax. I mean, something like:

export const Example = {
  someMethod: () => {
    // do something  
  }
}

just wouldn't sit right with me