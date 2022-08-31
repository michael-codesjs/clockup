import { AWS } from "../../types/aws";
import { commonPluginConfig, commonEnviromentVariables, commomEnviromentResources, commonCloudFormationImports, commonCustom, commonPlugins, commonProviderAttributes } from "../../utilities/commons";


const serverlessConfiguration: AWS.Service = {

  service: "photo",

  provider: {
    ...commonProviderAttributes,
    environment: {
      ...commonEnviromentVariables,
      ...commomEnviromentResources
    }
  },

  plugins: [
    ...commonPlugins
  ],

  custom: {
    ...commonCustom,
    ...commonCloudFormationImports,
    ...commonPluginConfig
  },

  package: {
    individually: true
  },

  functions: {

    getImageUploadURL: {
      handler: "functions/get-image-upload-url.handler",
      iamRoleStatements: [
        {
          Effect: "Allow",
          Action: ["s3:PutObject", "s3:PutObjectAcl"],
          Resource: [
            "${self:custom.assetBucketArn}",
            "${self:custom.assetBucketArn}/*"
          ]
        }
      ]
    }

  }

}

module.exports = serverlessConfiguration;