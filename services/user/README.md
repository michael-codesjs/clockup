Serverless user microservice for the **clock-up** platform.

## **Dependencies & Installation**
This microservice is a **Node/Typescript** component, so install dependencies by running **`yarn install`** in the component root folder(services/user).

## **Deploying & Destroying**

You should have an AWS Account and your credentials set on your local machine. I like to do so via the shared credentials file, you can do so too by following [**these**](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html) instructions. These credentials are used by The Serverless Framework to deploy the microservice to your AWS account.

To deploy and destroy the microservice, run **`npx sls deploy`** and **`npx sls remove`** respectively in the component root folder.

## **Testing**

To run tests, you'll first have to:
- Set the **AWS_REGION** enviroment variable to whatever region you deployed the infrastructure and services to. For example: **`export AWS_REGION=eu-central-1`**.
- Generate enviroment variables. You can do so by running **`npx sls export-env`** in the component root directory.

Refer to the `package.json` for specific tests otherwise run **`yarn test`** in the component root directory to test everything concerning the user service.