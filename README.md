# **clock-up backend**
This repository contains the serverless backend for the [clock-up](https://github.com/michael-codesjs/clock-up) front-end.

If you are gonna take a lot the actual code, read the [**TECHNICAL_README.md**](https://github.com/michael-codesjs/clock-up-backend/blob/main/TECHNICAL_README.md) first.

## **Documentation**
To generate documentation, run `npm run documentation`.
A **documentation** folder will be created in the project root directory with some .html files innit.
Run the index.html file with live server or any other way of your choosing to view the generated docs.

**Note:** At the time of writing, the docs generated are not done well and are probably not gonna be of much help to you. 

## **Installation**
The app is split into several separate micro-services that are all dependent on a root infrastructure.

Make sure you have the serverless framework version "3" globally installed on your machines. To install & learn more about the serverless framework, follow [these instructions](https://www.serverless.com/framework/docs/getting-started).

## **Deploying**
This app is meant to run on AWS infrastructure, you'll need to have your **aws credentials** set on your local machine. To do so, follow [these instructions](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html)
Make sure the AWS account you will use can create AppSync apps. To make sure it does, create an appsync app using one of the aws templates in the console. You can delete it immediately afterwards.

To deploy, run `sls deploy --aws-profile your-aws-profile-name` in the root folder.

## **Contributing**
If you wish to contribute to this project, go on and folk the repo and open that PR when you're done. Even the smallest of changes/bug fixes/improvements will be appreciated.
