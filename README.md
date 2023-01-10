# **clock-up**

Welcome, this repository contains everything that makes up the clock-up platform.
The backend comprised of several serverless microservices, web clients comprised of several micro front-ends and a cross platform native app.
This project is very experimental and far from done. 
* **[Figma Design Project](https://www.figma.com/files/project/63897376/clock-up?fuid=1075770680965640589)**

## **Dependencies & Installation**

Install dependecies of **Node/Typescript** components by running **`yarn install`** in the component directory(this includes the root directory).

Our infrastructure is defined and deployed to AWS using HashiCorp's **Terraform**. To install the Terraform CLI, follow [**these**](https://developer.hashicorp.com/terraform/tutorials/aws-get-started/install-cli) instructions.

## **Deploying & Destroying**

You should have an AWS Account and your credentials set on your local machine. I like to do so via the shared credentials file, you can do so too by following [**these**](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html) instructions. These credentials are used by Terraform and The Serverless Framework to deploy the infrastructure and microservices to your AWS account.

To deploy and destroy the infrastructure and/or microservices, run the commands **`yarn deploy`** and **`yarn destroy`** respectively and let the scripts I wrote handle the long process of deploying/destroying the backend for you. The scripts will ask you a few questions before deploying. **Note**: these scripts require you to install dependencies of every microservice.

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
