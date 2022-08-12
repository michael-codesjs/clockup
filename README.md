# clock-up backend
This repository contains the serverless backend for the [clock-up](https://github.com/michael-codesjs/clock-up) front-end.

## Installation
The app is split into several separate micro-services that are all dependent on a root infrastructure.

Make sure you have the serverless framework version "3" globally installed on your machines. To install & learn more about the serverless framework, follow [these instructions](https://www.serverless.com/framework/docs/getting-started).

## Deploying
This app is meant to run on AWS, you'll need to have your **aws credentials** set. To do so, follow [these instructions](https://docs.aws.amazon.com/sdk-for-javascript/v2/developer-guide/loading-node-credentials-shared.html)
Make sure the AWS account you will use can create AppSync apps. To make sure it does, create an appsync app using one of the aws templates in the console. You can delete it immediately afterwards

To deploy locally, run sls deploy --aws-profile "your-aws-profile-name" in the root folder. This will deploy it to the AWS account associated with the profile you put in.
