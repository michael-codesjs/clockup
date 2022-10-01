# **clock-up backend**
This repository contains the serverless backend for the [clock-up](https://github.com/michael-codesjs/clock-up) front-end.

If you are gonna take a lot the actual code, read the [**TECHNICAL_README.md**](https://github.com/michael-codesjs/clock-up-backend/blob/main/TECHNICAL_README.md) first.

## **Installation**
The app is split into several separate micro-services that are all dependent on a root infrastructure.

Make sure you have the serverless framework version "3" globally installed on your machines. To install & learn more about the serverless framework, follow [these instructions](https://www.serverless.com/framework/docs/getting-started).

## **Deploying**
This app is meant to run on AWS infrastructure, you'll need to have your **aws credentials** set on local machine. To do so, follow [these instructions](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html)
Make sure the AWS account you will use can create AppSync apps. To make sure it does, create an appsync app using one of the aws templates in the console. You can delete it immediately afterwards.

To deploy, run `sls deploy --aws-profile your-aws-profile-name` in the root folder. T
