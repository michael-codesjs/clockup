# **clock-up**
Serverless backend for the clock up front-end. The app is split into several separate services that are all dependent on a root infrastructure & framework.
At the moment, the only services completed & working are the authentication & user service. I'm currently working on the alarm entity group & service.

* [DynamoDB Schema](https://docs.google.com/spreadsheets/d/1EYoTWwzbV6BqmQ7m5NTOcZJNXM3eSF4EHg3DeTIVX9k/edit?usp=sharing)

## **Installation**
Running `yarn install` in the root project directory should set you up with all the project dependencies.

## **Deploying**

Make sure you have your AWS credentials set, to do so follow [these](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html) instructions.

To deploy a service, run `npx sls deploy` in the service directory. This will by default deploy the service to the **dev** stage. To deploy to a preffered stage, run `npx sls deploy --stage [stage-name]` where [stage-name] is replaced with your desired stage, eg: production.

To deploy all services at once, run `npx sls deploy` in the root project directory and let **serverless compose** deploy our services for us.

## **Testing**

You'll first have to:
- Set the **AWS_REGION** enviroment variable to whatever region you deployed the services to. For example: `export AWS_REGION=eu-central-1`.
- Generate enviroment variables. You can do so by running the **yarn run setup** file in the root directory.


Refer to the `package.json` for specific tests. Otherwise, run:
```sh
yarn test
```
to run every test in existence.

## **Meta**

Michael Phiri – [@michael_wcjs](https://twitter.com/michael_wcjs) – michael.codesjs@gmail.com

## **Contributing**

1. Fork it (<https://github.com/michael-codesjs/clock-up-backend/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

Some useful resources that will help understand the codebase.
* **[Dive Into DESIGN PATTERNS](https://refactoring.guru/design-patterns/book)**.
* **[The DynamoDB Book](https://www.dynamodbbook.com/)**
* **[Alex Debrie: The What, Why, and When of Single-Table Design with DynamoDB](https://www.alexdebrie.com/posts/dynamodb-single-table/)**
* **[Fundamentals of Amazon DynamoDB Single Table Design with Rick Houlihan](https://youtu.be/KYy8X8t4MB8)**
