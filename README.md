# **clock-up**
Serverless backend for the clock-up platform that is split into several decoupled microservices.

* [DynamoDB Schema](https://docs.google.com/spreadsheets/d/1EYoTWwzbV6BqmQ7m5NTOcZJNXM3eSF4EHg3DeTIVX9k/edit?usp=sharing)

## **Dependencies & Installation**

Install dependencies by running **`yarn install`** in the root directory and service directories.

Our infrastructure is defined and deployed to AWS using HashiCorp's **Terraform**. To install the Terraform CLI, follow [**these**](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) instructions.

## **Deploying & Destroying**

You should have an AWS Account and your credentials set on your local machine. I like to do so via the shared credentials file, you can do so too by following [**these**](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html) instructions. These credentials are used by Terraform and The Serverless Framework to deploy the infrastructure and microservices to your AWS account.

To deploy and destroy your infrastructure and microservices, run the commands **`yarn deploy`** and **`yarn destroy`**.

**Note:** the deploy and destroy scripts are custom scripts and can be found in the **scripts/state** folder.

## **Testing**

To run tests, you'll first have to:
- Set the **AWS_REGION** enviroment variable to whatever region you deployed the infrastructure and services to. For example: **`export AWS_REGION=eu-central-1`**.
- Generate enviroment variables. You can do so by running **`yarn generate-env`**.

Refer to the `package.json` files for specific tests.
## **Meta**

Michael Phiri – [@michael_wcjs](https://twitter.com/michael_wcjs) – michael.codesjs@gmail.com

## **Contributing**

1. Fork it (<https://github.com/michael-codesjs/clock-up-backend/fork>)
2. Create your feature branch (`git checkout -b feature/fooBar`)
3. Commit your changes (`git commit -am 'Add some fooBar'`)
4. Push to the branch (`git push origin feature/fooBar`)
5. Create a new Pull Request

### **Some useful resources that will help understand the codebase.**
* **[Dive Into DESIGN PATTERNS](https://refactoring.guru/design-patterns/book)**.
* **[The DynamoDB Book](https://www.dynamodbbook.com/)**
* **[Alex Debrie: The What, Why, and When of Single-Table Design with DynamoDB](https://www.alexdebrie.com/posts/dynamodb-single-table/)**
* **[Fundamentals of Amazon DynamoDB Single Table Design with Rick Houlihan](https://youtu.be/KYy8X8t4MB8)**
