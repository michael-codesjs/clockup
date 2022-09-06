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

    uploadImageToS3: {
      handler: 'functions/upload-image-to-s3.handler',
      events: [
        {
          http: {
            path: 'image-upload',
            method: 'post',
            cors: true,
          },
        },
      ],
      iamRoleStatements: [
        {
          Effect: 'Allow',
          Action: ['s3:PutObject', 's3:PutObjectAcl'],
          Resource: [
            '${self:custom.photoBucketArn}',
            '${self:custom.photoBucketArn}' + '/*',
          ],
        },
      ],
    },

  }

}

module.exports = serverlessConfiguration;