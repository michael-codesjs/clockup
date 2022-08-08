import { dynamoDbResource } from "../../resources";
import { AWS } from "../../types/aws";
import { commonCustom } from "../../utilities/commons";
import { config, stackOutputNames } from "../../utilities/constants";
import { generateLogicalResourcelName, generateServiceName } from "../../utilities/functions";



const serverlessConfiguration: AWS.Extended = {

  service: generateServiceName("root"),
  
  provider: {
    name: config.provider,
    region: config.region,
    stage: config.stage,
    runtime: config.runtime
  },

  custom: {
    ...commonCustom,
    tableName: generateLogicalResourcelName("table")
  },

  resources: {

    Resources: {
      ...dynamoDbResource
    },

    Outputs: {

      [stackOutputNames.root.table.name]: {
        Value: { Ref: "DynamoDbTable" },
        Export: { Name: stackOutputNames.root.table.name }
      },

      [stackOutputNames.root.table.arn]: {
        Value: { "Fn::GetAtt": ["DynamoDbTable", "Arn"] },
        Export: { Name: stackOutputNames.root.table.arn }
      }

    }
  }
}

module.exports = serverlessConfiguration;