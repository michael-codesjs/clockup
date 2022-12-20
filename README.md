# **clock-up**
Serverless backend for the clock-up platform that is split into several decoupled microservices.

* [DynamoDB Schema](https://docs.google.com/spreadsheets/d/1EYoTWwzbV6BqmQ7m5NTOcZJNXM3eSF4EHg3DeTIVX9k/edit?usp=sharing)

## **Dependencies & Installation**

Install dependencies in the root directory by running **`yarn install`** in the root project directory. These dependencies are required for scripts, testing shared typescript code and many more.

Each microservice, NodeJS based or not uses its own Serverless Framework version, run **`yarn install`** in the service directory to install it's NodeJS dependencies. If the service has lambda functions written in another language other than NodeJS, run that languages equivalent of **`yarn install`** to install the dependencies.

Our infrastructure is defined and deployed to AWS using HashiCorp's **Terraform**. To install the Terraform CLI, follow [**these**](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) instructions.

## **Deploying & Destroying**

Make sure you have your **AWS credentials** set, to do so follow [**these**](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html) instructions. These credentials are used by both Terraform and the Serverless Framework to deploy the infrastructure and microservices(respectively) to AWS.

To **deploy** everything(infrastructure and microservices) at one go, run **`yarn deploy`**. A script will first deploy the infrastructure and then the microservices.

To **destroy** everything(infrastructure and microservices) at one go, run **`yarn deploy`**. A script will first destroy the microservices and then the infrastructure.

The **deploy** and **destroy** scripts will ask you for the stage and region the projects will be/is deployed to. Defaults are **dev** and **eu-central-1**.

## **Testing**

To run tests, you'll first have to:
- Set the **AWS_REGION** enviroment variable to whatever region you deployed the services to. For example: **`export AWS_REGION=eu-central-1`**.
- Generate enviroment variables. You can do so by running **`yarn setup`**.

Refer to the `package.json` for specific tests.
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
