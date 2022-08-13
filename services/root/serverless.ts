import { dynamoDbResource } from "../../resources";
import { AWS } from "../../types/aws";
import { commonCustom, commonPluginConfig, commonPlugins } from "../../utilities/commons";
import { config, logicalResourceNames, stacks } from "../../utilities/constants";
import { generateLogicalResourcelName, generateServiceName } from "../../utilities/functions";



const serverlessConfiguration: AWS.Service = {

  service: generateServiceName("root"),
  
  provider: {
    name: config.provider,
    region: config.region,
    stage: config.stage,
    runtime: config.runtime
  },

  plugins: [
    ...commonPlugins
  ],

  package: {
    individually: true
  },

  custom: {
    ...commonCustom,
    ...commonPluginConfig,
    tableName: generateLogicalResourcelName("table"),
    userPoolName: generateLogicalResourcelName("userPool")
  },

  resources: {

    Resources: {
      ...dynamoDbResource,
    },

    Outputs: {

      [stacks.root.outputs.table.name]: {
        Value: { Ref: logicalResourceNames.table },
        Export: { Name: stacks.root.outputs.table.name }
      },

      [stacks.root.outputs.table.arn]: {
        Value: { "Fn::GetAtt": [logicalResourceNames.table, "Arn"] },
        Export: { Name: stacks.root.outputs.table.arn }
      }

    }
  }
}

module.exports = serverlessConfiguration;